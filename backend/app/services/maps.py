"""
KrishiMitra AI — Google Maps Service
======================================
Purpose     : Client wrapper for Google Geocoding and Distance Matrix integrations.
Respons.    : Lookup mandi GPS points and calculate travel driving durations/costs.
Dependencies: app.services.external_base, pydantic, sqlalchemy.ext.asyncio
"""

from __future__ import annotations

import hashlib
import math
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError
from app.services.external_base import BaseExternalService

logger = get_logger(__name__)
settings = get_settings()


class GeocodeInput(BaseModel):
    address: str = Field(..., description="Location address or Mandi name to query")


class GeocodeResponse(BaseModel):
    latitude: float
    longitude: float
    formatted_address: str


class DistanceInput(BaseModel):
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float


class DistanceResponse(BaseModel):
    distance_km: float
    travel_time_seconds: float
    fuel_cost: float
    toll_cost: float
    route_provider: str = "Google Maps"


class GoogleMapsService(BaseExternalService):
    """
    GoogleMapsService handles address coordinates conversion and driving route distance matrices.
    """

    def __init__(self) -> None:
        super().__init__(
            base_url="https://maps.googleapis.com/maps/api",
            timeout=6.0,  # 6 second timeout
        )

    def _generate_cache_key(self, prefix: str, *args: Any) -> str:
        raw_key = f"{prefix}:" + ":".join(str(a).lower() for a in args)
        return hashlib.sha256(raw_key.encode()).hexdigest()

    async def geocode_address(
        self,
        db: AsyncSession,
        query: GeocodeInput,
    ) -> GeocodeResponse:
        """
        Convert physical address/mandi name to GPS coordinates.
        Falls back to approximate coordinate centers if Google API fails.
        """
        cache_key = self._generate_cache_key("geocode", query.address)

        try:
            cached = await self._get_cached_response(db, cache_key)
            if cached:
                return GeocodeResponse(**cached)
        except Exception as e:
            logger.warning("geocode_cache_lookup_failed", error=str(e))

        try:
            response = await self._request_with_retry(
                "GET",
                "/geocode/json",
                params={
                    "address": query.address,
                    "key": settings.GOOGLE_GEOCODING_API_KEY,
                },
            )
            response_json = response.json()
            results = response_json.get("results", [])

            if not results:
                raise ExternalAPIError(f"No coordinates found for address: {query.address}")

            location = results[0]["geometry"]["location"]
            result = GeocodeResponse(
                latitude=location["lat"],
                longitude=location["lng"],
                formatted_address=results[0]["formatted_address"],
            )

            await self._set_cached_response(
                db=db,
                provider="Google Maps",
                cache_key=cache_key,
                response_json=result.model_dump(),
                ttl_seconds=86400,  # Cache geocoding for 24 hours
            )
            return result

        except Exception as e:
            logger.error("google_geocode_api_failed_falling_back", error=str(e))
            # Fallback: return approximate center coordinate for Indore/Madhya Pradesh
            logger.info("google_geocode_approximate_fallback_activated")
            return GeocodeResponse(
                latitude=22.7196,
                longitude=75.8577,
                formatted_address=f"Approximate coordinates for {query.address}",
            )

    async def calculate_route(
        self,
        db: AsyncSession,
        query: DistanceInput,
    ) -> DistanceResponse:
        """
        Calculate driving distance and time.
        Falls back to Haversine straight-line approximation if API is down.
        """
        cache_key = self._generate_cache_key(
            "distance",
            query.origin_lat,
            query.origin_lng,
            query.dest_lat,
            query.dest_lng,
        )

        try:
            cached = await self._get_cached_response(db, cache_key)
            if cached:
                return DistanceResponse(**cached)
        except Exception as e:
            logger.warning("distance_cache_lookup_failed", error=str(e))

        try:
            response = await self._request_with_retry(
                "GET",
                "/distancematrix/json",
                params={
                    "origins": f"{query.origin_lat},{query.origin_lng}",
                    "destinations": f"{query.dest_lat},{query.dest_lng}",
                    "key": settings.GOOGLE_DISTANCE_MATRIX_API_KEY,
                },
            )
            response_json = response.json()
            row = response_json["rows"][0]["elements"][0]

            if row["status"] != "OK":
                raise ExternalAPIError("Distance matrix status check failed.")

            distance_km = row["distance"]["value"] / 1000.0
            duration_sec = row["duration"]["value"]

            # Calculate mock logistics charges (fuel + toll)
            fuel = distance_km * 9.0  # Rs 9 per km
            toll = 100.0 if distance_km > 50 else 0.0

            result = DistanceResponse(
                distance_km=distance_km,
                travel_time_seconds=duration_sec,
                fuel_cost=fuel,
                toll_cost=toll,
            )

            await self._set_cached_response(
                db=db,
                provider="Google Maps",
                cache_key=cache_key,
                response_json=result.model_dump(),
                ttl_seconds=86400,
            )
            return result

        except Exception as e:
            logger.error("google_distance_api_failed_falling_back", error=str(e))
            # Fallback: compute straight-line Haversine distance
            lat1, lon1 = math.radians(query.origin_lat), math.radians(query.origin_lng)
            lat2, lon2 = math.radians(query.dest_lat), math.radians(query.dest_lng)
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
            c = 2 * math.asin(math.sqrt(a))
            approx_km = 6371 * c  # Earth radius
            approx_sec = (approx_km / 50.0) * 3600  # Assume avg 50 km/h

            logger.info("google_distance_haversine_fallback_success", distance=approx_km)
            return DistanceResponse(
                distance_km=approx_km,
                travel_time_seconds=approx_sec,
                fuel_cost=approx_km * 9.0,
                toll_cost=0.0,
                route_provider="Haversine Approximation",
            )

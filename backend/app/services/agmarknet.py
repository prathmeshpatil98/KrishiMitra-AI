"""
KrishiMitra AI — AGMARKNET Service
===================================
Purpose     : Client wrapper for fetching Mandi crop market prices.
Respons.    : Request live rates, apply input/output schema validation, and cache responses.
Dependencies: app.services.external_base, app.repositories.market, pydantic
"""

from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError
from app.repositories.market import MarketPriceRepository
from app.services.external_base import BaseExternalService

logger = get_logger(__name__)
settings = get_settings()


class MandiPriceInput(BaseModel):
    crop_name: str = Field(..., description="Crop standard name")
    state: str = Field(..., description="State name")
    district: Optional[str] = Field(None, description="District name")


class MandiPriceRecord(BaseModel):
    market_name: str
    state: str
    district: str
    crop_name: str
    price: float
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    unit: str = "Quintal"
    price_date: str


class AGMARKNETService(BaseExternalService):
    """
    AGMARKNETService fetches crop arrivals and modal rates from agricultural portals.
    """

    def __init__(self, price_repo: MarketPriceRepository) -> None:
        super().__init__(
            base_url=settings.AGMARKNET_BASE_URL,
            timeout=8.0,  # 8 second timeout threshold
        )
        self._price_repo = price_repo

    def _generate_cache_key(self, crop: str, state: str, district: Optional[str]) -> str:
        """Create unique hash identifier key for endpoint query caching."""
        raw_key = f"agmarknet:{crop.lower()}:{state.lower()}:{str(district).lower()}"
        return hashlib.sha256(raw_key.encode()).hexdigest()

    async def get_mandi_prices(
        self,
        db: AsyncSession,
        query: MandiPriceInput,
    ) -> List[MandiPriceRecord]:
        """
        Fetch crop pricing listings from Agmarknet API.
        Falls back to local database records on connection failure.
        """
        cache_key = self._generate_cache_key(query.crop_name, query.state, query.district)

        # 1. Attempt lookup in persistent database cache table
        try:
            cached_data = await self._get_cached_response(db, cache_key)
            if cached_data:
                return [MandiPriceRecord(**item) for item in cached_data.get("prices", [])]
        except Exception as e:
            logger.warning("agmarknet_cache_lookup_failed", error=str(e))

        # 2. Cache miss -> query live third party API
        try:
            # Construct API params
            params = {
                "api-key": settings.AGMARKNET_API_KEY,
                "format": "json",
                "crop": query.crop_name,
                "state": query.state,
            }
            if query.district:
                params["district"] = query.district

            # Execute HTTP GET request
            response = await self._request_with_retry(
                "GET",
                "/prices",
                params=params,
            )

            response_json = response.json()

            # Map raw response into standardized list format
            # In a real run, this parses the specific AGMARKNET endpoint structure
            raw_prices = response_json.get("records", [])
            price_records: List[MandiPriceRecord] = []

            for record in raw_prices:
                price_records.append(
                    MandiPriceRecord(
                        market_name=record.get("mandi_name", "Unknown Mandi"),
                        state=record.get("state", query.state),
                        district=record.get("district", "Unknown"),
                        crop_name=record.get("commodity", query.crop_name),
                        price=float(record.get("modal_price", 0.0)),
                        min_price=float(record.get("min_price", 0.0)),
                        max_price=float(record.get("max_price", 0.0)),
                        price_date=record.get("arrival_date", ""),
                    )
                )

            # Save results back to database cache table
            serialized_payload = {"prices": [r.model_dump() for r in price_records]}
            await self._set_cached_response(
                db=db,
                provider="AGMARKNET",
                cache_key=cache_key,
                response_json=serialized_payload,
                ttl_seconds=settings.CACHE_TTL_MARKET,
            )

            return price_records

        except Exception as e:
            logger.error("agmarknet_api_failed_falling_back_to_db", error=str(e))
            # 3. Fallback: query historical database prices table
            try:
                db_prices = await self._price_repo.search(
                    query=query.crop_name,
                    state=query.state,
                )
                if db_prices:
                    logger.info("agmarknet_db_fallback_success", count=len(db_prices))
                    return [
                        MandiPriceRecord(
                            market_name="Mandi Info",
                            state=query.state,
                            district=query.district or "Unknown",
                            crop_name=p.crop_name,
                            price=p.price,
                            min_price=p.min_price,
                            max_price=p.max_price,
                            price_date=p.price_date.isoformat(),
                        )
                        for p in db_prices
                    ]
            except Exception as db_err:
                logger.error("agmarknet_db_fallback_failed", error=str(db_err))

            raise ExternalAPIError("Mandi price services are currently unavailable.") from e

"""
KrishiMitra AI — OpenWeather Service
=====================================
Purpose     : Client wrapper for fetching OpenWeatherMap API metrics.
Respons.    : Get current conditions and forecasts for target harvest location.
Dependencies: app.services.external_base, pydantic, sqlalchemy.ext.asyncio
"""

from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError
from app.services.external_base import BaseExternalService

logger = get_logger(__name__)
settings = get_settings()


class WeatherInput(BaseModel):
    latitude: float
    longitude: float


class ForecastDay(BaseModel):
    date: str
    temperature: float
    rain_probability: float
    description: str


class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    rain_probability: float
    description: str
    forecast: List[ForecastDay]
    warning_flag: bool = False
    warning_message: Optional[str] = None


class OpenWeatherService(BaseExternalService):
    """
    OpenWeatherService fetches real-time temperature, wind, and rain details for harvesting decision matrices.
    """

    def __init__(self) -> None:
        super().__init__(
            base_url=settings.OPENWEATHER_BASE_URL,
            timeout=5.0,  # 5 second timeout
        )

    def _generate_cache_key(self, lat: float, lng: float) -> str:
        # standardise coordinates by rounding to 2 decimal places to cache nearby lookups together
        rounded_lat = round(lat, 2)
        rounded_lng = round(lng, 2)
        raw_key = f"weather:{rounded_lat}:{rounded_lng}"
        return hashlib.sha256(raw_key.encode()).hexdigest()

    async def get_weather(
        self,
        db: AsyncSession,
        query: WeatherInput,
    ) -> WeatherResponse:
        """
        Fetch weather parameters.
        Returns a warning response block if the API is down, allowing the agent to continue.
        """
        cache_key = self._generate_cache_key(query.latitude, query.longitude)

        # 1. Check database persistent cache
        try:
            cached = await self._get_cached_response(db, cache_key)
            if cached:
                return WeatherResponse(**cached)
        except Exception as e:
            logger.warning("weather_cache_lookup_failed", error=str(e))

        # 2. Query live OpenWeather API
        try:
            response = await self._request_with_retry(
                "GET",
                "/onecall",
                params={
                    "lat": query.latitude,
                    "lon": query.longitude,
                    "appid": settings.OPENWEATHER_API_KEY,
                    "units": "metric",
                    "exclude": "minutely,hourly",
                },
            )
            response_json = response.json()
            current = response_json.get("current", {})
            daily = response_json.get("daily", [])

            forecast_days: List[ForecastDay] = []
            for day in daily[:3]:  # Map next 3 days forecast
                forecast_days.append(
                    ForecastDay(
                        date=datetime.fromtimestamp(day.get("dt", 0)).strftime("%Y-%m-%d"),
                        temperature=float(day.get("temp", {}).get("day", 25.0)),
                        rain_probability=float(day.get("pop", 0.0)),
                        description=day.get("weather", [{}])[0].get("description", "cloudy"),
                    )
                )

            result = WeatherResponse(
                temperature=float(current.get("temp", 25.0)),
                humidity=float(current.get("humidity", 50.0)),
                wind_speed=float(current.get("wind_speed", 0.0)),
                rain_probability=float(daily[0].get("pop", 0.0)) if daily else 0.0,
                description=current.get("weather", [{}])[0].get("description", "Clear"),
                forecast=forecast_days,
            )

            # Save weather metrics cache
            await self._set_cached_response(
                db=db,
                provider="OpenWeather",
                cache_key=cache_key,
                response_json=result.model_dump(),
                ttl_seconds=settings.CACHE_TTL_WEATHER,
            )
            return result

        except Exception as e:
            logger.error("openweather_api_failed_falling_back_to_warning_stub", error=str(e))
            # 3. Graceful degradation: return default warning weather payload so graph does not crash
            return WeatherResponse(
                temperature=28.0,
                humidity=55.0,
                wind_speed=2.5,
                rain_probability=0.2,
                description="Average conditions (weather API down)",
                forecast=[
                    ForecastDay(date="Tomorrow", temperature=28.0, rain_probability=0.2, description="Cloudy"),
                    ForecastDay(date="Day after", temperature=29.0, rain_probability=0.1, description="Sunny"),
                ],
                warning_flag=True,
                warning_message="Weather service currently offline. Displaying generalized crop cycle climate defaults.",
            )


# Import datetime for timestamp parsing
from datetime import datetime

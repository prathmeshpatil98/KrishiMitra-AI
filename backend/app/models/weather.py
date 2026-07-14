"""
KrishiMitra AI — Weather Cache Model
=====================================
Purpose     : SQLAlchemy model declarations for weather caches.
Respons.    : Declare weather_cache table with latitude/longitude indexes and forecast details.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class WeatherCache(BaseModel):
    """
    WeatherCache model stores local weather forecasts with expiration details.
    """

    __tablename__ = "weather_cache"

    latitude: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="Latitude coordinate of weather cache",
    )

    longitude: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="Longitude coordinate of weather cache",
    )

    temperature: Mapped[float] = mapped_column(
        nullable=False,
        comment="Current temperature in Celsius",
    )

    humidity: Mapped[float] = mapped_column(
        nullable=False,
        comment="Current humidity level percentage",
    )

    wind_speed: Mapped[float] = mapped_column(
        nullable=False,
        comment="Wind speed in meters/second",
    )

    rain_probability: Mapped[float] = mapped_column(
        nullable=False,
        comment="Precipitation risk probability value",
    )

    forecast_json: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        comment="Nested daily forecast JSON payload data",
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        comment="Timestamp when cache expires",
    )

    def __repr__(self) -> str:
        return f"<WeatherCache lat={self.latitude!r} lng={self.longitude!r} expires={self.expires_at!r}>"

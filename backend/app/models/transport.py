"""
KrishiMitra AI — Transport Route Cache Model
=============================================
Purpose     : SQLAlchemy model declarations for transport route calculations.
Respons.    : Declare transport_routes table with GPS coordinates, distance, time, and cache checks.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class TransportRoute(BaseModel):
    """
    TransportRoute model caches distance and logistics cost calculations between coordinates.
    """

    __tablename__ = "transport_routes"

    origin_lat: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="Start latitude coordinate",
    )

    origin_lng: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="Start longitude coordinate",
    )

    destination_lat: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="End latitude coordinate",
    )

    destination_lng: Mapped[float] = mapped_column(
        nullable=False,
        index=True,
        comment="End longitude coordinate",
    )

    distance_km: Mapped[float] = mapped_column(
        nullable=False,
        comment="Distance in kilometers",
    )

    travel_time: Mapped[float] = mapped_column(
        nullable=False,
        comment="Expected travel duration in seconds",
    )

    fuel_cost: Mapped[Optional[float]] = mapped_column(
        comment="Estimated fuel cost in INR",
    )

    toll_cost: Mapped[Optional[float]] = mapped_column(
        comment="Estimated toll charges in INR",
    )

    route_provider: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default="Google Maps",
        comment="API provider source name",
    )

    cached_until: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        comment="Timestamp when route cache expires",
    )

    def __repr__(self) -> str:
        return f"<TransportRoute distance={self.distance_km!r} km provider={self.route_provider!r}>"

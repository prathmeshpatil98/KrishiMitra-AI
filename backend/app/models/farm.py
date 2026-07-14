"""
KrishiMitra AI — Farm & Crop Models
====================================
Purpose     : SQLAlchemy model declarations for farms and crops.
Respons.    : Declare farms table, crops table, constraints, and relationships.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Farm(BaseModel):
    """
    Farm model stores farm information owned by a farmer.
    """

    __tablename__ = "farms"

    farmer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("farmer_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to owner farmer profile",
    )

    farm_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Name of the farm",
    )

    latitude: Mapped[Optional[float]] = mapped_column(
        comment="Latitude coordinate of the farm",
    )

    longitude: Mapped[Optional[float]] = mapped_column(
        comment="Longitude coordinate of the farm",
    )

    total_area: Mapped[Optional[float]] = mapped_column(
        comment="Total farm area in acres",
    )

    irrigation_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Irrigation source/type (e.g. rainfed, tube well, canal)",
    )

    ownership_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Farm ownership category (e.g. owned, leased)",
    )

    # Relationships
    farmer: Mapped[FarmerProfile] = relationship("FarmerProfile", back_populates="farms")
    crops: Mapped[List[Crop]] = relationship(
        "Crop",
        back_populates="farm",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Farm name={self.farm_name!r}>"


class Crop(BaseModel):
    """
    Crop model represents crop items grown on a specific farm.
    """

    __tablename__ = "crops"

    farm_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("farms.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to the parent farm",
    )

    crop_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="Name of the crop (e.g. Wheat, Rice, Cotton)",
    )

    quantity: Mapped[Optional[float]] = mapped_column(
        comment="Estimated crop quantity in quintals",
    )

    expected_harvest: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Estimated crop harvest date",
    )

    quality_grade: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        comment="Quality tier/grade (e.g. Grade A, Grade B)",
    )

    estimated_cost: Mapped[Optional[float]] = mapped_column(
        comment="Estimated production cost",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="PLANTED",
        comment="Crop cycle stage (PLANTED | GROWING | HARVESTED | SOLD)",
    )

    # Relationships
    farm: Mapped[Farm] = relationship("Farm", back_populates="crops")
    recommendations: Mapped[List[Recommendation]] = relationship(
        "Recommendation",
        back_populates="crop",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Crop name={self.crop_name!r} status={self.status!r}>"


# Import stubs to resolve circular dependencies in annotations
from app.models.user import FarmerProfile
from app.models.recommendation import Recommendation

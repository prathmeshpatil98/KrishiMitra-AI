"""
KrishiMitra AI — Recommendation Model
=======================================
Purpose     : SQLAlchemy model declarations for AI crop optimization recommendations.
Respons.    : Declare recommendations table, foreign keys, and indexes.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Recommendation(BaseModel):
    """
    Recommendation model stores historical AI insights generated for a farmer's crop selection and market decisions.
    """

    __tablename__ = "recommendations"

    farmer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("farmer_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to farmer profile",
    )

    crop_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("crops.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Reference to specific crop evaluated",
    )

    recommended_market: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Name of recommended market/mandi",
    )

    expected_profit: Mapped[Optional[float]] = mapped_column(
        comment="Optimized net profit expectation in INR",
    )

    transport_cost: Mapped[Optional[float]] = mapped_column(
        comment="Estimated logistics costs in INR",
    )

    weather_risk: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Flagged weather alert/warning description",
    )

    confidence: Mapped[Optional[float]] = mapped_column(
        comment="Confidence rating percentage (e.g. 0.85 for 85%)",
    )

    recommendation_json: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Raw JSON log of LangGraph reasoning path details",
    )

    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
        comment="Timestamp when recommendation was saved",
    )

    # Relationships
    farmer: Mapped[FarmerProfile] = relationship("FarmerProfile", back_populates="recommendations")
    crop: Mapped[Optional[Crop]] = relationship("Crop", back_populates="recommendations")

    def __repr__(self) -> str:
        return f"<Recommendation market={self.recommended_market!r} profit={self.expected_profit!r}>"


# Import stubs to resolve circular dependencies in annotations
from app.models.user import FarmerProfile
from app.models.farm import Crop

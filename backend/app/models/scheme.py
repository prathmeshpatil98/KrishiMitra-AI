"""
KrishiMitra AI — Government Scheme Model
=========================================
Purpose     : SQLAlchemy model declarations for government schemes.
Respons.    : Declare government_schemes table, eligibility, benefits, and website.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class GovernmentScheme(BaseModel):
    """
    GovernmentScheme model stores information about available welfare and financial support schemes for farmers.
    """

    __tablename__ = "government_schemes"

    scheme_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="Official name of the scheme",
    )

    government: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Issuing body (e.g. Central, Central + State, State)",
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Scheme category (e.g. Finance, Crop Insurance, Subsidy)",
    )

    eligibility: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Eligibility requirements guidelines text description",
    )

    benefits: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Details of financial or support assistance provided",
    )

    documents: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Required documents list description text",
    )

    deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Application deadline timestamp",
    )

    website: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Official portal website URL link",
    )

    def __repr__(self) -> str:
        return f"<GovernmentScheme name={self.scheme_name!r}>"

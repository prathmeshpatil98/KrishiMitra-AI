"""
KrishiMitra AI — Market & MarketPrice Models
=============================================
Purpose     : SQLAlchemy model declarations for mandis and price histories.
Respons.    : Declare markets table, market_prices table, unique constraints, and indexes.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Market(BaseModel):
    """
    Market model represents local markets/mandis.
    """

    __tablename__ = "markets"

    market_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="Market/Mandi name",
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="District name",
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="State name",
    )

    latitude: Mapped[Optional[float]] = mapped_column(
        comment="GPS coordinates latitude of market",
    )

    longitude: Mapped[Optional[float]] = mapped_column(
        comment="GPS coordinates longitude of market",
    )

    address: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Physical address of market",
    )

    market_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Market category (e.g. Mandi, wholesale, retail)",
    )

    # Relationships
    prices: Mapped[List[MarketPrice]] = relationship(
        "MarketPrice",
        back_populates="market",
        cascade="all, delete-orphan",
    )

    # Constraints
    __table_args__ = (
        UniqueConstraint("market_name", "state", name="uq_market_name_state"),
    )

    def __repr__(self) -> str:
        return f"<Market name={self.market_name!r} state={self.state!r}>"


class MarketPrice(BaseModel):
    """
    MarketPrice model stores historical arrivals and prices for crops in mandis.
    """

    __tablename__ = "market_prices"

    market_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("markets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to parent market record",
    )

    crop_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
        comment="Crop name (standardised format)",
    )

    price: Mapped[float] = mapped_column(
        nullable=False,
        comment="Modal price per quintal",
    )

    min_price: Mapped[Optional[float]] = mapped_column(
        comment="Minimum price per quintal",
    )

    max_price: Mapped[Optional[float]] = mapped_column(
        comment="Maximum price per quintal",
    )

    arrival_quantity: Mapped[Optional[float]] = mapped_column(
        comment="Arrival volume quantity in tonnes or quintals",
    )

    unit: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
        default="Quintal",
        comment="Unit of measurement",
    )

    price_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        comment="Date of price record",
    )

    source: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        default="AGMARKNET",
        comment="Source of price record (e.g. AGMARKNET)",
    )

    # Relationships
    market: Mapped[Market] = relationship("Market", back_populates="prices")

    def __repr__(self) -> str:
        return f"<MarketPrice crop={self.crop_name!r} price={self.price!r}>"

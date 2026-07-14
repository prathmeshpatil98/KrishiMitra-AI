"""
KrishiMitra AI — User & FarmerProfile Models
============================================
Purpose     : SQLAlchemy model declarations for users and farmer profiles.
Respons.    : Declare users table, farmer_profiles table, constraints, and relationships.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class User(BaseModel):
    """
    User model stores core authentication credentials and roles.
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Unique user email address",
    )

    phone: Mapped[Optional[str]] = mapped_column(
        String(50),
        unique=True,
        nullable=True,
        index=True,
        comment="Unique user phone number",
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="bcrypt password hash",
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="farmer",
        comment="User role (farmer | admin | government_officer)",
    )

    preferred_language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en",
        comment="Preferred language code (en | hi | mr)",
    )

    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp of last login",
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        comment="Whether email or phone is verified",
    )

    # 1:1 relationship with FarmerProfile
    farmer_profile: Mapped[Optional[FarmerProfile]] = relationship(
        "FarmerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Relationship with Conversations
    conversations: Mapped[List[Conversation]] = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # Relationship with Notifications
    notifications: Mapped[List[Notification]] = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<User email={self.email!r} role={self.role!r}>"


class FarmerProfile(BaseModel):
    """
    FarmerProfile model stores detailed demographic and location info for farmers.
    """

    __tablename__ = "farmer_profiles"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
        comment="Reference to parent users table record",
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Farmer full name",
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="State name",
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="District name",
    )

    village: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Village name",
    )

    latitude: Mapped[Optional[float]] = mapped_column(
        comment="GPS coordinates latitude for mapping and transport calculations",
    )

    longitude: Mapped[Optional[float]] = mapped_column(
        comment="GPS coordinates longitude for mapping and transport calculations",
    )

    farm_size: Mapped[Optional[float]] = mapped_column(
        comment="Total farm size in acres or hectares",
    )

    soil_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Type of soil on the farm",
    )

    primary_crop: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Primary crop name grown by farmer",
    )

    secondary_crop: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Secondary crop name grown by farmer",
    )

    preferred_market: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        comment="Preferred local mandi or market",
    )

    preferred_language: Mapped[Optional[str]] = mapped_column(
        String(10),
        nullable=True,
        comment="Preferred language overrides user level setting",
    )

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="farmer_profile")
    farms: Mapped[List[Farm]] = relationship(
        "Farm",
        back_populates="farmer",
        cascade="all, delete-orphan",
    )
    recommendations: Mapped[List[Recommendation]] = relationship(
        "Recommendation",
        back_populates="farmer",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<FarmerProfile full_name={self.full_name!r} district={self.district!r}>"


# Import stubs to resolve circular dependencies in annotations
from app.models.chat import Conversation
from app.models.notification import Notification
from app.models.farm import Farm
from app.models.recommendation import Recommendation

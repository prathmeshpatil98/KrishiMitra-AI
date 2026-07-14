"""
KrishiMitra AI — Notification Model
====================================
Purpose     : SQLAlchemy model declarations for user alerts and notifications.
Respons.    : Declare notifications table, foreign keys, and indexes.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Notification(BaseModel):
    """
    Notification model stores broadcast alerts, weather alerts, or price updates sent to users.
    """

    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to owner user",
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Title heading of alert",
    )

    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Main description text of alert",
    )

    notification_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Alert category (e.g. price_alert | weather_risk | system)",
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        comment="Flag indicating if the user read the notification",
    )

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="notifications")

    def __repr__(self) -> str:
        return f"<Notification title={self.title!r} type={self.notification_type!r} is_read={self.is_read!r}>"


# Import stubs to resolve circular dependencies in annotations
from app.models.user import User

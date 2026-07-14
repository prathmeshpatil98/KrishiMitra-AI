"""
KrishiMitra AI — SQLAlchemy Audit Base Model
=============================================
Purpose     : Provide a reusable base SQLAlchemy model with all mandatory audit columns.
Respons.    : Every domain model inherits from this to guarantee UUID PKs, timestamps,
              soft-delete support, and optimistic versioning.
Dependencies: SQLAlchemy 2.x, app.database.base
Usage       : from app.models.base import BaseModel

Every table produced by a subclass will have:
    id          UUID PRIMARY KEY (auto-generated)
    created_at  TIMESTAMPTZ — set on INSERT
    updated_at  TIMESTAMPTZ — set on UPDATE
    created_by  UUID — FK to users.id (nullable, set by service layer)
    updated_by  UUID — FK to users.id (nullable, set by service layer)
    deleted_at  TIMESTAMPTZ NULL — soft delete marker
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
    version     INTEGER NOT NULL DEFAULT 1 — for optimistic locking
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class BaseModel(Base):
    """
    Abstract SQLAlchemy model that provides universal audit columns.

    All domain models (User, FarmerProfile, Market, etc.) must inherit from this.
    Do not create tables directly using Base — always use BaseModel.

    The `__abstract__ = True` declaration tells SQLAlchemy not to create a
    table for this class itself.
    """

    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
        comment="UUID primary key — never expose sequential integers externally.",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Timestamp when the record was created (UTC).",
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Timestamp when the record was last updated (UTC).",
    )

    created_by: Mapped[Optional[str]] = mapped_column(
        String(36),
        nullable=True,
        index=True,
        comment="UUID of the user who created this record.",
    )

    updated_by: Mapped[Optional[str]] = mapped_column(
        String(36),
        nullable=True,
        comment="UUID of the user who last updated this record.",
    )

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        comment="Soft-delete marker. NULL = active. Non-NULL = deleted.",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        comment="Whether this record is logically active.",
    )

    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
        comment="Optimistic locking version counter.",
    )

    # ------------------------------------------------------------------
    # Convenience helpers
    # ------------------------------------------------------------------

    @property
    def is_deleted(self) -> bool:
        """True if this record has been soft-deleted."""
        return self.deleted_at is not None

    def soft_delete(self, deleted_by: str | None = None) -> None:
        """
        Mark this record as soft-deleted.

        Args:
            deleted_by: UUID of the user performing the delete.
        """
        self.deleted_at = datetime.now(tz=UTC)
        self.is_active = False
        if deleted_by:
            self.updated_by = deleted_by

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} id={self.id!r}>"

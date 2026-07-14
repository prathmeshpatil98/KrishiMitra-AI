"""
KrishiMitra AI — Notification Repository
=========================================
Purpose     : Database operations on notifications.
Respons.    : CRUD operations, user alerts query lists, mark-as-read, and searches.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.notification
"""

from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.repositories.base import AbstractRepository


class NotificationRepository(AbstractRepository[Notification]):
    """
    NotificationRepository implements data operations on Notification models.
    """

    model = Notification

    async def get_unread_by_user_id(self, user_id: str) -> List[Notification]:
        """
        Fetch all unread notifications for a user.
        """
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .where(self.model.is_read.is_(False))
            .where(self.model.deleted_at.is_(None))
            .order_by(self.model.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def mark_all_as_read(self, user_id: str) -> None:
        """
        Mark all unread notifications of a user as read.
        """
        stmt = (
            update(self.model)
            .where(self.model.user_id == user_id)
            .where(self.model.is_read.is_(False))
            .where(self.model.deleted_at.is_(None))
            .values(is_read=True)
        )
        await self._session.execute(stmt)

    async def search(self, query: str, **filters: Any) -> List[Notification]:
        """
        Search notifications by title, and filter by user_id or notification_type.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.title.ilike(f"%{query}%"))

        user_id = filters.get("user_id")
        if user_id:
            stmt = stmt.where(self.model.user_id == user_id)

        notification_type = filters.get("notification_type")
        if notification_type:
            stmt = stmt.where(self.model.notification_type == notification_type)

        is_read = filters.get("is_read")
        if is_read is not None:
            stmt = stmt.where(self.model.is_read == is_read)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

"""
KrishiMitra AI — Conversation & Message Repositories
=====================================================
Purpose     : Database operations on conversations and messages.
Respons.    : CRUD operations, user session histories, message lists, and search queries.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.chat
"""

from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import Conversation, Message
from app.repositories.base import AbstractRepository


class ConversationRepository(AbstractRepository[Conversation]):
    """
    ConversationRepository implements data operations on Conversation models.
    """

    model = Conversation

    async def get_by_user_id(
        self, user_id: str, include_deleted: bool = False
    ) -> List[Conversation]:
        """
        List all chat sessions started by a user.
        """
        stmt = select(self.model).where(self.model.user_id == user_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        # Order by latest message exchange first
        stmt = stmt.order_by(self.model.last_message_at.desc())

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[Conversation]:
        """
        Search conversations by title, and filter by user_id or language.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.title.ilike(f"%{query}%"))

        user_id = filters.get("user_id")
        if user_id:
            stmt = stmt.where(self.model.user_id == user_id)

        language = filters.get("language")
        if language:
            stmt = stmt.where(self.model.language == language)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())


class MessageRepository(AbstractRepository[Message]):
    """
    MessageRepository implements data operations on Message models.
    """

    model = Message

    async def get_by_conversation_id(
        self, conversation_id: str, include_deleted: bool = False
    ) -> List[Message]:
        """
        Fetch all messages in chronological order inside a chat session.
        """
        stmt = select(self.model).where(self.model.conversation_id == conversation_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        # Chronological order
        stmt = stmt.order_by(self.model.created_at.asc())

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[Message]:
        """
        Search message texts by keyword, and filter by conversation_id.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.content.ilike(f"%{query}%"))

        conversation_id = filters.get("conversation_id")
        if conversation_id:
            stmt = stmt.where(self.model.conversation_id == conversation_id)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

"""
KrishiMitra AI — User & FarmerProfile Repositories
==================================================
Purpose     : Database operations on users and farmer profiles.
Respons.    : CRUD operations, email/phone lookup, and searches.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.user
"""

from __future__ import annotations

from typing import Any, List, Optional
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, FarmerProfile
from app.repositories.base import AbstractRepository


class UserRepository(AbstractRepository[User]):
    """
    UserRepository implements data operations on User models.
    """

    model = User

    async def get_by_email(self, email: str, include_deleted: bool = False) -> Optional[User]:
        """
        Lookup a user by email address.

        Returns None if no matching user is found.
        """
        stmt = select(self.model).where(self.model.email == email)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_phone(self, phone: str, include_deleted: bool = False) -> Optional[User]:
        """
        Lookup a user by phone number.

        Returns None if no matching user is found.
        """
        stmt = select(self.model).where(self.model.phone == phone)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def search(self, query: str, **filters: Any) -> List[User]:
        """
        Search users by email or phone search term.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(
                or_(
                    self.model.email.ilike(f"%{query}%"),
                    self.model.phone.ilike(f"%{query}%"),
                )
            )

        # Apply optional filters
        role = filters.get("role")
        if role:
            stmt = stmt.where(self.model.role == role)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())


class FarmerProfileRepository(AbstractRepository[FarmerProfile]):
    """
    FarmerProfileRepository implements data operations on FarmerProfile models.
    """

    model = FarmerProfile

    async def get_by_user_id(self, user_id: str, include_deleted: bool = False) -> FarmerProfile:
        """
        Lookup profile associated with user_id.
        """
        stmt = select(self.model).where(self.model.user_id == user_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        profile = result.scalar_one_or_none()
        if not profile:
            raise NotFoundError(
                f"Farmer profile for user ID '{user_id}' was not found.",
                error_code="PROFILE_NOT_FOUND",
            )
        return profile

    async def search(self, query: str, **filters: Any) -> List[FarmerProfile]:
        """
        Search profiles by full name.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.full_name.ilike(f"%{query}%"))

        # Apply location filters
        state = filters.get("state")
        if state:
            stmt = stmt.where(self.model.state == state)

        district = filters.get("district")
        if district:
            stmt = stmt.where(self.model.district == district)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

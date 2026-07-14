"""
KrishiMitra AI — Government Scheme Repository
===============================================
Purpose     : Database operations on government welfare schemes.
Respons.    : CRUD operations, details search, and listings.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.scheme
"""

from __future__ import annotations

from typing import Any, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scheme import GovernmentScheme
from app.repositories.base import AbstractRepository


class GovernmentSchemeRepository(AbstractRepository[GovernmentScheme]):
    """
    GovernmentSchemeRepository implements data operations on GovernmentScheme models.
    """

    model = GovernmentScheme

    async def search(self, query: str, **filters: Any) -> List[GovernmentScheme]:
        """
        Search schemes by name, benefits or eligibility, and filter by government or category.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(
                or_(
                    self.model.scheme_name.ilike(f"%{query}%"),
                    self.model.benefits.ilike(f"%{query}%"),
                    self.model.eligibility.ilike(f"%{query}%"),
                )
            )

        government = filters.get("government")
        if government:
            stmt = stmt.where(self.model.government == government)

        category = filters.get("category")
        if category:
            stmt = stmt.where(self.model.category == category)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

"""
KrishiMitra AI — Recommendation Repository
============================================
Purpose     : Database operations on recommendations.
Respons.    : CRUD operations, farmer-specific listings, and searches.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.recommendation
"""

from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recommendation import Recommendation
from app.repositories.base import AbstractRepository


class RecommendationRepository(AbstractRepository[Recommendation]):
    """
    RecommendationRepository implements data operations on Recommendation models.
    """

    model = Recommendation

    async def get_by_farmer_id(
        self, farmer_id: str, include_deleted: bool = False
    ) -> List[Recommendation]:
        """
        List all recommendations generated for a farmer.
        """
        stmt = select(self.model).where(self.model.farmer_id == farmer_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        # Order by newest first
        stmt = stmt.order_by(self.model.generated_at.desc())

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[Recommendation]:
        """
        Search recommendations by recommended_market, and filter by farmer_id or crop_id.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.recommended_market.ilike(f"%{query}%"))

        farmer_id = filters.get("farmer_id")
        if farmer_id:
            stmt = stmt.where(self.model.farmer_id == farmer_id)

        crop_id = filters.get("crop_id")
        if crop_id:
            stmt = stmt.where(self.model.crop_id == crop_id)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

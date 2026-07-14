"""
KrishiMitra AI — Market & MarketPrice Repositories
===================================================
Purpose     : Database operations on mandis and crop prices.
Respons.    : CRUD operations, lookups, unique checks, and history fetches.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.market
"""

from __future__ import annotations

from typing import Any, List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.market import Market, MarketPrice
from app.repositories.base import AbstractRepository


class MarketRepository(AbstractRepository[Market]):
    """
    MarketRepository implements data operations on Market models.
    """

    model = Market

    async def get_by_name_and_state(self, market_name: str, state: str) -> Optional[Market]:
        """
        Fetch market matching name and state combination (unique constraint check).
        """
        stmt = select(self.model).where(
            and_(
                self.model.market_name == market_name,
                self.model.state == state,
                self.model.deleted_at.is_(None)
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def search(self, query: str, **filters: Any) -> List[Market]:
        """
        Search markets by name, and filter by state/district.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.market_name.ilike(f"%{query}%"))

        state = filters.get("state")
        if state:
            stmt = stmt.where(self.model.state == state)

        district = filters.get("district")
        if district:
            stmt = stmt.where(self.model.district == district)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())


class MarketPriceRepository(AbstractRepository[MarketPrice]):
    """
    MarketPriceRepository implements data operations on MarketPrice models.
    """

    model = MarketPrice

    async def get_latest_price(self, market_id: str, crop_name: str) -> Optional[MarketPrice]:
        """
        Fetch the most recent price record for a crop in a mandi.
        """
        stmt = (
            select(self.model)
            .where(
                and_(
                    self.model.market_id == market_id,
                    self.model.crop_name == crop_name,
                    self.model.deleted_at.is_(None)
                )
            )
            .order_by(self.model.price_date.desc())
            .limit(1)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_price_history(
        self, market_id: str, crop_name: str, limit: int = 30
    ) -> List[MarketPrice]:
        """
        Fetch historical price trends for a crop in a mandi.
        """
        stmt = (
            select(self.model)
            .where(
                and_(
                    self.model.market_id == market_id,
                    self.model.crop_name == crop_name,
                    self.model.deleted_at.is_(None)
                )
            )
            .order_by(self.model.price_date.desc())
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[MarketPrice]:
        """
        Search prices by crop_name, and filter by market_id.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.crop_name.ilike(f"%{query}%"))

        market_id = filters.get("market_id")
        if market_id:
            stmt = stmt.where(self.model.market_id == market_id)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

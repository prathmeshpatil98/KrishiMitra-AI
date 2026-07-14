"""
KrishiMitra AI — Farm & Crop Repositories
==========================================
Purpose     : Database operations on farms and crops.
Respons.    : CRUD operations, list filtering, and searches.
Dependencies: SQLAlchemy 2.x, app.repositories.base, app.models.farm
"""

from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.farm import Farm, Crop
from app.repositories.base import AbstractRepository


class FarmRepository(AbstractRepository[Farm]):
    """
    FarmRepository implements data operations on Farm models.
    """

    model = Farm

    async def get_by_farmer_id(self, farmer_id: str, include_deleted: bool = False) -> List[Farm]:
        """
        List all farms matching farmer_id.
        """
        stmt = select(self.model).where(self.model.farmer_id == farmer_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[Farm]:
        """
        Search farms by name, and filter by farmer_id.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.farm_name.ilike(f"%{query}%"))

        farmer_id = filters.get("farmer_id")
        if farmer_id:
            stmt = stmt.where(self.model.farmer_id == farmer_id)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())


class CropRepository(AbstractRepository[Crop]):
    """
    CropRepository implements data operations on Crop models.
    """

    model = Crop

    async def get_by_farm_id(self, farm_id: str, include_deleted: bool = False) -> List[Crop]:
        """
        List all crops matching farm_id.
        """
        stmt = select(self.model).where(self.model.farm_id == farm_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def search(self, query: str, **filters: Any) -> List[Crop]:
        """
        Search crops by crop_name, and filter by farm_id or status.
        """
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        if query:
            stmt = stmt.where(self.model.crop_name.ilike(f"%{query}%"))

        farm_id = filters.get("farm_id")
        if farm_id:
            stmt = stmt.where(self.model.farm_id == farm_id)

        status = filters.get("status")
        if status:
            stmt = stmt.where(self.model.status == status)

        result = await self._session.execute(stmt)
        return list(result.scalars().all())

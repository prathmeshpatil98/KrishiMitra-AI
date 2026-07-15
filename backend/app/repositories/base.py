"""
KrishiMitra AI — Abstract Repository Base
==========================================
Purpose     : Define the generic async repository contract for all database operations.
Respons.    : CRUD + search only. No business logic, no API calls, no AI calls.
Dependencies: SQLAlchemy 2.x async, app.models.base, app.core.exceptions
Usage       : class UserRepository(AbstractRepository[User]): ...

Repositories receive an AsyncSession via constructor injection.
Services are the only callers of repositories.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DatabaseError, NotFoundError
from app.core.logging import get_logger
from app.models.base import BaseModel

logger = get_logger(__name__)

ModelT = TypeVar("ModelT", bound=BaseModel)


class AbstractRepository(ABC, Generic[ModelT]):
    """
    Generic async repository that provides CRUD operations for any SQLAlchemy model.

    Type Parameter:
        ModelT: The SQLAlchemy ORM model class this repository manages.

    Every concrete repository must:
        1. Call super().__init__(session) to store the session.
        2. Set the `model` class attribute to the ORM model class.
        3. Override only the methods that require specialised behaviour.

    Example:
        class MarketRepository(AbstractRepository[Market]):
            model = Market

            async def find_by_state(self, state: str) -> list[Market]:
                result = await self._session.execute(
                    select(self.model).where(self.model.state == state)
                )
                return list(result.scalars().all())
    """

    model: type[ModelT]

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Read Operations
    # ------------------------------------------------------------------

    async def get_by_id(self, entity_id: str, include_deleted: bool = False) -> ModelT:
        """
        Retrieve a single entity by its UUID.

        Args:
            entity_id      : The UUID string of the entity.
            include_deleted: If True, returns soft-deleted records too.

        Returns:
            The ORM model instance.

        Raises:
            NotFoundError: If no matching record exists.
        """
        stmt = select(self.model).where(self.model.id == entity_id)
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        result = await self._session.execute(stmt)
        entity = result.scalar_one_or_none()

        if entity is None:
            raise NotFoundError(
                f"{self.model.__name__} with id '{entity_id}' was not found.",
                error_code="NOT_FOUND",
            )
        return entity

    async def get(self, entity_id: str, include_deleted: bool = False) -> ModelT:
        """
        Alias for get_by_id.

        Used by higher-level services and endpoint handlers that call `repo.get(...)`.
        """
        return await self.get_by_id(entity_id, include_deleted=include_deleted)

    async def get_all(
        self,
        page: int = 1,
        limit: int = 20,
        include_deleted: bool = False,
        order_by: Any = None,
    ) -> tuple[list[ModelT], int]:
        """
        Retrieve a paginated list of entities.

        Args:
            page           : 1-indexed page number.
            limit          : Maximum records per page.
            include_deleted: Include soft-deleted records.
            order_by       : Optional SQLAlchemy column expression for sorting.

        Returns:
            Tuple of (list of entities, total count).
        """
        offset = (page - 1) * limit

        base_stmt = select(self.model)
        if not include_deleted:
            base_stmt = base_stmt.where(self.model.deleted_at.is_(None))

        # Count query
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        count_result = await self._session.execute(count_stmt)
        total: int = count_result.scalar_one()

        # Data query
        data_stmt = base_stmt.offset(offset).limit(limit)
        if order_by is not None:
            data_stmt = data_stmt.order_by(order_by)
        else:
            data_stmt = data_stmt.order_by(self.model.created_at.desc())

        data_result = await self._session.execute(data_stmt)
        items = list(data_result.scalars().all())

        return items, total

    # ------------------------------------------------------------------
    # Write Operations
    # ------------------------------------------------------------------

    async def create(self, entity: ModelT) -> ModelT:
        """
        Persist a new entity to the database.

        Args:
            entity: A fully initialised ORM model instance.

        Returns:
            The persisted entity with all database-generated fields populated.

        Raises:
            DatabaseError: If persistence fails.
        """
        try:
            self._session.add(entity)
            await self._session.flush()
            await self._session.refresh(entity)
            logger.debug(
                "entity_created",
                model=self.model.__name__,
                entity_id=entity.id,
            )
            return entity
        except Exception as exc:
            logger.error(
                "entity_create_failed",
                model=self.model.__name__,
                error=str(exc),
            )
            raise DatabaseError(f"Failed to create {self.model.__name__}.") from exc

    async def update(self, entity: ModelT) -> ModelT:
        """
        Merge and persist changes to an existing entity.

        Args:
            entity: The modified ORM model instance.

        Returns:
            The updated entity.
        """
        try:
            merged = await self._session.merge(entity)
            await self._session.flush()
            await self._session.refresh(merged)
            logger.debug(
                "entity_updated",
                model=self.model.__name__,
                entity_id=entity.id,
            )
            return merged
        except Exception as exc:
            logger.error(
                "entity_update_failed",
                model=self.model.__name__,
                entity_id=entity.id,
                error=str(exc),
            )
            raise DatabaseError(f"Failed to update {self.model.__name__}.") from exc

    async def soft_delete(self, entity_id: str, deleted_by: str | None = None) -> None:
        """
        Soft-delete an entity by setting deleted_at and is_active = False.

        Args:
            entity_id  : UUID of the entity to delete.
            deleted_by : UUID of the acting user (for audit).
        """
        from datetime import UTC, datetime

        entity = await self.get_by_id(entity_id)
        entity.soft_delete(deleted_by=deleted_by)
        await self._session.flush()
        logger.info(
            "entity_soft_deleted",
            model=self.model.__name__,
            entity_id=entity_id,
            deleted_by=deleted_by,
        )

    async def hard_delete(self, entity_id: str) -> None:
        """
        Permanently delete an entity from the database.

        Use with extreme caution — prefer soft_delete() in production.

        Args:
            entity_id: UUID of the entity to permanently remove.
        """
        entity = await self.get_by_id(entity_id, include_deleted=True)
        await self._session.delete(entity)
        await self._session.flush()
        logger.warning(
            "entity_hard_deleted",
            model=self.model.__name__,
            entity_id=entity_id,
        )

    # ------------------------------------------------------------------
    # Search (override in concrete repos)
    # ------------------------------------------------------------------

    @abstractmethod
    async def search(self, query: str, **filters: Any) -> list[ModelT]:
        """
        Search for entities matching the given query and filters.

        Concrete repositories must implement domain-specific search logic.

        Args:
            query   : Free-text search term.
            **filters: Additional named filter parameters.

        Returns:
            List of matching entities.
        """
        ...

"""
KrishiMitra AI — Abstract Service Base
========================================
Purpose     : Define the base class for all domain services in the KrishiMitra AI backend.
Respons.    : Enforce a consistent logging and error-propagation pattern across all services.
Dependencies: app.repositories.base, app.core.logging, app.core.exceptions
Usage       : class MarketService(AbstractService[MarketRepository]): ...

Services contain all business logic.
Services call repositories for persistence.
Services call external APIs when required.
Services never render UI or return HTTP responses directly.
"""

from __future__ import annotations

from typing import Generic, TypeVar

from app.core.logging import get_logger
from app.repositories.base import AbstractRepository

RepositoryT = TypeVar("RepositoryT", bound=AbstractRepository)


class AbstractService(Generic[RepositoryT]):
    """
    Generic base class for all KrishiMitra AI services.

    Concrete services receive their repository (and any additional dependencies)
    via constructor injection and expose domain-level methods.

    Type Parameter:
        RepositoryT: The repository type this service depends on.

    Design Contract:
        - One service per domain boundary (MarketService, WeatherService, ...).
        - Services must never call another service directly. Use the repository.
        - Services must never query the database from a FastAPI route.
        - Services handle retry, caching, and external API orchestration.

    Example:
        class MarketService(AbstractService[MarketRepository]):
            def __init__(
                self,
                repository: MarketRepository,
                redis: aioredis.Redis,
            ) -> None:
                super().__init__(repository)
                self._redis = redis

            async def get_nearby_markets(self, location: str) -> list[MarketResponse]:
                ...
    """

    def __init__(self, repository: RepositoryT) -> None:
        self._repository = repository
        self._logger = get_logger(self.__class__.__module__)

    @property
    def repository(self) -> RepositoryT:
        """The repository instance this service operates on."""
        return self._repository

    def _log_operation(self, operation: str, **context: object) -> None:
        """
        Emit a structured info log for a service operation.

        Args:
            operation: Short description of the operation being performed.
            **context: Additional key-value pairs to include in the log entry.
        """
        self._logger.info(
            "service_operation",
            service=self.__class__.__name__,
            operation=operation,
            **context,
        )

    def _log_error(self, operation: str, error: Exception, **context: object) -> None:
        """
        Emit a structured error log for a failed service operation.

        Args:
            operation: Short description of the operation that failed.
            error    : The caught exception.
            **context: Additional key-value pairs to include in the log entry.
        """
        self._logger.error(
            "service_operation_failed",
            service=self.__class__.__name__,
            operation=operation,
            error=str(error),
            **context,
        )

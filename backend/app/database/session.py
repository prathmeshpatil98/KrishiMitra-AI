"""
KrishiMitra AI — Async Database Session
==========================================
Purpose     : Configure the async SQLAlchemy engine and provide session factory.
Respons.    : Create and manage async database connections with connection pooling.
Dependencies: SQLAlchemy 2.x (asyncio), asyncpg, app.core.config
Usage       : Injected via app.dependencies.database.get_db()

Never import this session directly into routes. Always use the dependency.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_engine: AsyncEngine | None = None
_async_session_factory: async_sessionmaker[AsyncSession] | None = None


def _build_engine() -> AsyncEngine:
    """Construct the async SQLAlchemy engine from current settings."""
    settings = get_settings()
    engine = create_async_engine(
        settings.DATABASE_URL,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_pre_ping=True,          # Detect stale connections before use
        echo=settings.DEBUG and not settings.is_production,
    )
    logger.info(
        "database_engine_created",
        host=settings.DATABASE_HOST,
        port=settings.DATABASE_PORT,
        database=settings.DATABASE_NAME,
        pool_size=settings.DATABASE_POOL_SIZE,
    )
    return engine


def get_engine() -> AsyncEngine:
    """Return the singleton async engine, creating it on first call."""
    global _engine  # noqa: PLW0603
    if _engine is None:
        _engine = _build_engine()
    return _engine


def get_async_session_factory() -> async_sessionmaker[AsyncSession]:
    """Return the singleton async session factory."""
    global _async_session_factory  # noqa: PLW0603
    if _async_session_factory is None:
        _async_session_factory = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return _async_session_factory


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async generator that yields a database session for use in dependency injection.

    The session is committed on success and rolled back on any exception.
    Always closed at the end of the request lifecycle.

    Yields:
        AsyncSession: An active SQLAlchemy async session.
    """
    factory = get_async_session_factory()
    async with factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def close_engine() -> None:
    """Dispose the engine and all pooled connections. Called on app shutdown."""
    global _engine  # noqa: PLW0603
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        logger.info("database_engine_disposed")

"""
KrishiMitra AI — Database Dependency
======================================
Purpose     : Provide an async database session as a FastAPI dependency.
Respons.    : Yield a scoped AsyncSession per request; commit/rollback automatically.
Dependencies: app.database.session
Usage       : async def endpoint(db: AsyncSession = Depends(get_db)): ...

Never import the session factory directly into routes or services.
Always use this dependency.
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a per-request async database session.

    The session is automatically committed on success and rolled back on failure.
    Always closed at the end of the request lifecycle regardless of outcome.

    Yields:
        AsyncSession: An active, request-scoped SQLAlchemy async session.

    Usage:
        @router.get("/example")
        async def example(db: AsyncSession = Depends(get_db)):
            ...
    """
    async for session in get_db_session():
        yield session

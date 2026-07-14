"""
KrishiMitra AI — Redis Dependency
====================================
Purpose     : Provide an async Redis client as a FastAPI dependency.
Respons.    : Initialise a Redis connection pool on startup and expose per-request clients.
Dependencies: redis[asyncio], app.core.config, app.core.logging
Usage       :
    async def endpoint(redis: aioredis.Redis = Depends(get_redis)):
        ...

The Redis pool is created once at application startup (see app/main.py lifespan).
"""

from __future__ import annotations

import redis.asyncio as aioredis

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_redis_pool: aioredis.Redis | None = None


async def init_redis_pool() -> aioredis.Redis:
    """
    Initialise the Redis connection pool.

    Called once during application startup lifespan.
    Returns the pool instance stored as a module-level singleton.

    Returns:
        aioredis.Redis: The initialised Redis client.

    Raises:
        Exception: If Redis is unreachable during startup.
    """
    global _redis_pool  # noqa: PLW0603
    settings = get_settings()

    _redis_pool = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5,
        retry_on_timeout=True,
        health_check_interval=30,
    )

    # Validate connectivity on startup
    await _redis_pool.ping()
    logger.info("redis_pool_initialised", url=settings.REDIS_URL.split("@")[-1])
    return _redis_pool


async def close_redis_pool() -> None:
    """
    Close the Redis connection pool.

    Called during application shutdown lifespan to release connections gracefully.
    """
    global _redis_pool  # noqa: PLW0603
    if _redis_pool is not None:
        await _redis_pool.aclose()
        _redis_pool = None
        logger.info("redis_pool_closed")


async def get_redis() -> aioredis.Redis:
    """
    FastAPI dependency that returns the active Redis client.

    Returns:
        aioredis.Redis: An active Redis client from the shared pool.

    Raises:
        RuntimeError: If Redis has not been initialised (lifespan not called).

    Usage:
        @router.get("/example")
        async def example(redis: aioredis.Redis = Depends(get_redis)):
            await redis.set("key", "value", ex=60)
    """
    if _redis_pool is None:
        raise RuntimeError(
            "Redis pool is not initialised. Ensure init_redis_pool() "
            "is called during application startup."
        )
    return _redis_pool


async def check_redis_health() -> dict[str, str]:
    """
    Perform a lightweight Redis health probe.

    Returns:
        dict with 'status': 'healthy' | 'unhealthy' and optional 'detail'.
    """
    if _redis_pool is None:
        return {"status": "unhealthy", "detail": "Redis pool not initialised"}
    try:
        await _redis_pool.ping()
        return {"status": "healthy"}
    except Exception as exc:
        logger.error("redis_health_check_failed", error=str(exc))
        return {"status": "unhealthy", "detail": "Redis unreachable"}

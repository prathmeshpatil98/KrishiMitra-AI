"""
KrishiMitra AI — Redis-backed Rate Limiting Middleware
=======================================================
Purpose     : Enforce per-client request rate limits using a Redis sliding-window counter.
Respons.    : Prevent API abuse; return 429 responses with Retry-After headers on violation.
Dependencies: redis[asyncio], app.core.config, app.core.exceptions
Usage       : Registered on the FastAPI app in app/main.py

Rate limits are enforced per remote IP address (or forwarded IP in proxy setups).
Different endpoints support different rate limit tiers.
"""

from __future__ import annotations

import time

import redis.asyncio as aioredis
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Endpoint groups with their own per-minute limits (overrides global limit)
_RATE_LIMIT_TIERS: dict[str, int] = {
    "/api/v1/auth": 10,       # Strict auth endpoints
    "/api/v1/chat": 30,       # AI conversation endpoints
    "/api/v1/voice": 20,      # Voice transcription endpoints
}


def _get_client_ip(request: Request) -> str:
    """Extract the real client IP, respecting X-Forwarded-For from trusted proxies."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _get_rate_limit_for_path(path: str, default: int) -> int:
    """Return the rate limit (requests/minute) for a given path prefix."""
    for prefix, limit in _RATE_LIMIT_TIERS.items():
        if path.startswith(prefix):
            return limit
    return default


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window rate limiter backed by Redis.

    Algorithm:
        - Key  : rate_limit:{ip}:{path_prefix}:{current_minute_bucket}
        - Value: Atomic INCR counter, expires in 60 seconds.
        - If counter > limit → return 429.

    The middleware degrades gracefully: if Redis is unavailable, requests
    pass through with a logged warning to avoid blocking legitimate traffic.
    """

    def __init__(self, app, redis_client: aioredis.Redis | None = None) -> None:
        super().__init__(app)
        self._redis: aioredis.Redis | None = redis_client

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        settings = get_settings()
        path = request.url.path

        # Skip rate limiting for health checks and internal paths
        if path in {f"{settings.API_PREFIX}/health", "/docs", "/redoc", "/openapi.json"}:
            return await call_next(request)

        if self._redis is None:
            logger.warning("rate_limiter_redis_unavailable", path=path)
            return await call_next(request)

        client_ip = _get_client_ip(request)
        limit = _get_rate_limit_for_path(path, settings.RATE_LIMIT_PER_MINUTE)
        minute_bucket = int(time.time()) // 60
        cache_key = f"rate_limit:{client_ip}:{minute_bucket}"

        try:
            pipe = self._redis.pipeline()
            pipe.incr(cache_key)
            pipe.expire(cache_key, 60)
            results = await pipe.execute()
            request_count: int = results[0]
        except Exception as exc:
            logger.error("rate_limiter_redis_error", error=str(exc))
            return await call_next(request)

        if request_count > limit:
            retry_after = 60 - (int(time.time()) % 60)
            logger.warning(
                "rate_limit_exceeded",
                client_ip=client_ip,
                path=path,
                request_count=request_count,
                limit=limit,
            )
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "message": "Too many requests. Please try again later.",
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "details": {"retry_after_seconds": retry_after},
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "request_id": getattr(request.state, "request_id", None),
                },
                headers={"Retry-After": str(retry_after)},
            )

        return await call_next(request)

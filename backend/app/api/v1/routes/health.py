"""
KrishiMitra AI — Health Check Endpoint
=========================================
Purpose     : Expose a structured health probe for infrastructure monitoring.
Respons.    : Report live status of PostgreSQL, Redis, and application core.
Dependencies: FastAPI, app.database.init_db, app.dependencies.redis
Usage       : GET /api/v1/health

This endpoint is excluded from authentication and rate limiting.
Used by load balancers, Kubernetes liveness/readiness probes, and monitoring tools.
"""

from __future__ import annotations

import time

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.logging import get_logger
from app.database.init_db import check_db_health
from app.dependencies.redis import check_redis_health

logger = get_logger(__name__)

router = APIRouter()


@router.get(
    "",
    summary="Platform Health Check",
    description=(
        "Returns the operational status of all KrishiMitra AI core infrastructure components: "
        "API server, PostgreSQL database, and Redis cache. "
        "Returns HTTP 200 if all components are healthy, HTTP 503 if any are degraded."
    ),
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
    tags=["Health"],
)
async def health_check() -> JSONResponse:
    """
    Performs a comprehensive health check across all infrastructure components.

    Response Fields:
        status       : 'healthy' | 'degraded'
        version      : Application version string
        environment  : 'development' | 'staging' | 'production'
        timestamp    : UTC ISO timestamp
        components   : Per-component status dict
            api      : Always 'healthy' if this endpoint responds
            database : 'healthy' | 'unhealthy'
            redis    : 'healthy' | 'unhealthy'

    HTTP Status:
        200 — All components healthy
        503 — One or more components unhealthy
    """
    settings = get_settings()
    start = time.perf_counter()

    # Run health probes concurrently
    import asyncio
    db_health, redis_health = await asyncio.gather(
        check_db_health(),
        check_redis_health(),
        return_exceptions=False,
    )

    duration_ms = round((time.perf_counter() - start) * 1000, 2)

    components = {
        "api": {"status": "healthy"},
        "database": db_health,
        "redis": redis_health,
    }

    all_healthy = all(
        c.get("status") == "healthy" for c in components.values()
    )
    overall_status = "healthy" if all_healthy else "degraded"
    http_status = status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE

    if not all_healthy:
        logger.warning(
            "health_check_degraded",
            components={k: v.get("status") for k, v in components.items()},
        )
    else:
        logger.info("health_check_ok", duration_ms=duration_ms)

    return JSONResponse(
        status_code=http_status,
        content={
            "status": overall_status,
            "version": settings.APP_VERSION,
            "environment": settings.APP_ENV,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "duration_ms": duration_ms,
            "components": components,
        },
    )

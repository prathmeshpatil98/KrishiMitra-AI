"""
KrishiMitra AI — FastAPI Application Factory
=============================================
Purpose     : Construct and configure the production FastAPI application.
Respons.    : Register middleware, exception handlers, routers, and lifespan hooks.
Dependencies: FastAPI, all middleware, all exception handlers, API router
Usage       : Imported by backend/main.py for uvicorn startup.

Architecture:
    Middleware stack (top-down execution):
        1. RequestIDMiddleware        → Attach unique request ID
        2. RequestLoggingMiddleware   → Log request/response
        3. RateLimitMiddleware        → Enforce per-client rate limits
        4. CORSMiddleware             → Cross-origin resource sharing

    Exception handlers:
        KrishiMitraException          → Domain errors (4xx/5xx)
        StarletteHTTPException        → Framework HTTP errors
        RequestValidationError        → Pydantic input validation failures
        Exception                     → Unhandled catch-all (500)
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import v1_router
from app.core.config import get_settings
from app.core.exceptions import KrishiMitraException
from app.core.logging import configure_logging, get_logger
from app.database.init_db import init_db
from app.dependencies.redis import close_redis_pool, get_redis, init_redis_pool
from app.middleware.error_handler import (
    http_exception_handler,
    krishimitra_exception_handler,
    request_validation_exception_handler,
    unhandled_exception_handler,
)
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_id import RequestIDMiddleware

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan context manager.

    Startup:
        1. Configure structured logging.
        2. Initialise the database (create tables, validate connection).
        3. Initialise the Redis connection pool.
        4. Wire the Redis client into the rate limiter middleware.

    Shutdown:
        1. Close the Redis connection pool.
        2. Dispose the SQLAlchemy engine and all pooled connections.
    """
    settings = get_settings()
    configure_logging()

    logger.info(
        "application_starting",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        env=settings.APP_ENV,
    )

    # --- Startup ---
    await init_db()
    redis_client = await init_redis_pool()

    # Attach the Redis client to the rate limit middleware instance
    current_app = getattr(app, "middleware_stack", None)
    while current_app is not None:
        if isinstance(current_app, RateLimitMiddleware):
            current_app._redis = redis_client
            break
        current_app = getattr(current_app, "app", None)

    logger.info("application_ready", host=settings.HOST, port=settings.PORT)

    yield  # Application is running here

    # --- Shutdown ---
    logger.info("application_shutting_down")
    await close_redis_pool()

    from app.database.session import close_engine
    await close_engine()

    logger.info("application_stopped")


def create_application() -> FastAPI:
    """
    Factory function that constructs the fully configured FastAPI application.

    Returns:
        FastAPI: The production-ready application instance.

    This function is the single source of truth for application configuration.
    All middleware, handlers, and routers are registered here and nowhere else.
    """
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "KrishiMitra AI is an intelligent multi-agent decision platform that helps farmers "
            "maximize profit by analyzing real-time market prices, weather, transportation costs, "
            "and government schemes using LangGraph AI agents."
        ),
        docs_url="/docs" if settings.ENABLE_SWAGGER and not settings.is_production else None,
        redoc_url="/redoc" if settings.ENABLE_SWAGGER and not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # -------------------------------------------------------------------------
    # Middleware Stack
    # Order matters: added last → executes first (LIFO stack).
    # -------------------------------------------------------------------------

    # 1. CORS — must be outermost to handle preflight requests
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # 2. Rate Limiting — Redis client is injected post-startup in lifespan
    app.add_middleware(RateLimitMiddleware, redis_client=None)

    # 3. Request Logging
    app.add_middleware(RequestLoggingMiddleware)

    # 4. Request ID — innermost, executes first on ingress
    app.add_middleware(RequestIDMiddleware)

    # -------------------------------------------------------------------------
    # Exception Handlers
    # -------------------------------------------------------------------------
    app.add_exception_handler(KrishiMitraException, krishimitra_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, request_validation_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_exception_handler)

    # -------------------------------------------------------------------------
    # Routers
    # -------------------------------------------------------------------------
    app.include_router(v1_router, prefix=settings.API_PREFIX)

    return app


# Module-level application instance — used by uvicorn
application = create_application()

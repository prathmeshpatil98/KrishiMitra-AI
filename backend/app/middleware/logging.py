"""
KrishiMitra AI — Request Logging Middleware
=============================================
Purpose     : Log every HTTP request with method, path, user, status code, and execution time.
Respons.    : Provide structured observability for every API call without verbose verbatim dumps.
Dependencies: Starlette, structlog, app.core.config
Usage       : Registered on the FastAPI app in app/main.py after RequestIDMiddleware.

Sensitive paths (e.g. /auth) have their bodies excluded from logs.
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from structlog.contextvars import bind_contextvars

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Paths that must never have their payloads logged
_SENSITIVE_PATHS: frozenset[str] = frozenset({
    "/api/v1/auth/login",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
    "/api/v1/users/me",
})


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs structured access records for every HTTP request.

    Log fields:
        method          : HTTP method (GET, POST, ...)
        path            : Request path
        status_code     : HTTP response status code
        duration_ms     : Response time in milliseconds
        request_id      : From request state (set by RequestIDMiddleware)
        is_sensitive     : Flag for sensitive endpoints — body not logged
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        settings = get_settings()

        if not settings.ENABLE_REQUEST_LOGGING:
            return await call_next(request)

        start_time = time.perf_counter()
        is_sensitive = request.url.path in _SENSITIVE_PATHS

        # Bind request context to structlog for this request's lifetime
        bind_contextvars(
            http_method=request.method,
            http_path=request.url.path,
            is_sensitive=is_sensitive,
        )

        response: Response = await call_next(request)

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
        status_code = response.status_code

        log_method = logger.warning if status_code >= 400 else logger.info
        log_method(
            "http_request_completed",
            method=request.method,
            path=request.url.path,
            status_code=status_code,
            duration_ms=duration_ms,
            request_id=getattr(request.state, "request_id", None),
        )

        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        return response

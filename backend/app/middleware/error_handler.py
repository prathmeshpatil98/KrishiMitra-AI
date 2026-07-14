"""
KrishiMitra AI — Global Error Handler Middleware
=================================================
Purpose     : Catch all exceptions and return consistent, structured JSON error responses.
Respons.    : Map custom domain exceptions to HTTP responses. Never expose stack traces externally.
Dependencies: FastAPI, app.core.exceptions, app.schemas.base
Usage       : Registered on the FastAPI app via add_exception_handler() in app/main.py

Error response format always matches APIErrorResponse schema:
{
    "success": false,
    "message": "...",
    "error_code": "...",
    "details": {},
    "timestamp": "...",
    "request_id": "..."
}
"""

from __future__ import annotations

import time
import traceback

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import get_settings
from app.core.exceptions import KrishiMitraException, RateLimitError
from app.core.logging import get_logger

logger = get_logger(__name__)


def _build_error_response(
    request: Request,
    status_code: int,
    message: str,
    error_code: str,
    details: dict | None = None,
) -> JSONResponse:
    """Construct a JSON error response that conforms to the standard error schema."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "error_code": error_code,
            "details": details or {},
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "request_id": getattr(request.state, "request_id", None),
        },
    )


async def krishimitra_exception_handler(
    request: Request, exc: KrishiMitraException
) -> JSONResponse:
    """
    Handle all custom KrishiMitraException subclasses.
    Maps each exception to its defined HTTP status code and error code.
    """
    logger.warning(
        "domain_exception",
        error_code=exc.error_code,
        message=exc.message,
        path=request.url.path,
    )
    headers = {}
    if isinstance(exc, RateLimitError):
        headers["Retry-After"] = str(exc.retry_after)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error_code": exc.error_code,
            "details": exc.details,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "request_id": getattr(request.state, "request_id", None),
        },
        headers=headers,
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handle standard Starlette HTTP exceptions (404, 405, etc.)."""
    logger.warning(
        "http_exception",
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path,
    )
    return _build_error_response(
        request=request,
        status_code=exc.status_code,
        message=str(exc.detail),
        error_code=f"HTTP_{exc.status_code}",
    )


async def request_validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handle Pydantic v2 request validation errors.
    Returns friendly, field-level validation messages.
    """
    field_errors = {}
    for error in exc.errors():
        field_path = " → ".join(str(loc) for loc in error["loc"])
        field_errors[field_path] = error["msg"]

    logger.warning(
        "request_validation_error",
        path=request.url.path,
        fields=list(field_errors.keys()),
    )
    return _build_error_response(
        request=request,
        status_code=422,
        message="Request validation failed. Please check the submitted fields.",
        error_code="VALIDATION_ERROR",
        details=field_errors,
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unexpected exceptions.
    Logs the full traceback internally but never exposes it to the client.
    """
    settings = get_settings()
    logger.error(
        "unhandled_exception",
        path=request.url.path,
        error=str(exc),
        traceback=traceback.format_exc(),
    )

    # Include traceback in response only in development mode
    details: dict = {}
    if settings.is_development and settings.DEBUG:
        details["traceback"] = traceback.format_exc()

    return _build_error_response(
        request=request,
        status_code=500,
        message="An unexpected error occurred. Our team has been notified.",
        error_code="INTERNAL_ERROR",
        details=details,
    )

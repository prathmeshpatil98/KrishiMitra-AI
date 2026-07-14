"""
KrishiMitra AI — Request ID Middleware
========================================
Purpose     : Attach a unique X-Request-ID header to every request and response.
Respons.    : Enables distributed tracing, log correlation, and client-side debugging.
Dependencies: Starlette, structlog.contextvars
Usage       : Registered on the FastAPI app in app/main.py

The request ID is stored in structlog context so all log entries within
the same request automatically include it.
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from structlog.contextvars import bind_contextvars, clear_contextvars

REQUEST_ID_HEADER = "X-Request-ID"


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Assigns a unique UUID to every incoming HTTP request.

    Priority:
        1. Use the value from the incoming X-Request-ID header if present (for gateway propagation).
        2. Generate a new UUID4 otherwise.

    The ID is:
        - Bound to structlog context for automatic log enrichment.
        - Returned in the response X-Request-ID header.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Clear any leftover context from the previous request (thread-safety)
        clear_contextvars()

        request_id = request.headers.get(REQUEST_ID_HEADER) or str(uuid.uuid4())

        # Bind to structlog context — all subsequent log calls in this request include it
        bind_contextvars(request_id=request_id)

        # Store on request state for downstream access
        request.state.request_id = request_id

        response: Response = await call_next(request)
        response.headers[REQUEST_ID_HEADER] = request_id
        return response

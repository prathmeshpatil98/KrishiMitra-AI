"""
KrishiMitra AI — Backend Entrypoint
=====================================
Purpose     : Launch the uvicorn ASGI server with the KrishiMitra AI FastAPI application.
Respons.    : Configure uvicorn from application settings and start the server.
Dependencies: uvicorn, app.core.config, app.app.main
Usage       : python main.py  (from the backend/ directory)

This file is the only entry point for local development and production deployment.
Never import this file from other modules.
"""

from __future__ import annotations

import uvicorn

from app.core.config import get_settings
from app.core.logging import configure_logging


def main() -> None:
    """
    Configure and start the uvicorn ASGI server.

    Settings are loaded from environment variables via Pydantic Settings.
    Never hardcode host, port, or worker count here.
    """
    configure_logging()
    settings = get_settings()

    uvicorn.run(
        "app.main:application",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS if settings.is_production else 1,
        reload=settings.is_development,
        log_level=settings.LOG_LEVEL.lower(),
        access_log=False,       # Handled by RequestLoggingMiddleware
        proxy_headers=True,     # Trust X-Forwarded-For from reverse proxy
        forwarded_allow_ips="*",
    )


if __name__ == "__main__":
    main()

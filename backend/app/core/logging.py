"""
KrishiMitra AI — Structured Logging
=====================================
Purpose     : Configures structlog for context-aware, JSON structured logging across the entire backend.
Respons.    : Provide a consistent logging interface. Enrich every log with request_id, user_id, route.
Dependencies: structlog, logging (stdlib)
Usage       : from app.core.logging import get_logger; logger = get_logger(__name__)

Never use print(). Always use this logger.
"""

from __future__ import annotations

import logging
import sys
from typing import Any

import structlog
from structlog.types import EventDict, WrappedLogger

from app.core.config import get_settings

_CONFIGURED = False


def _add_app_context(
    logger: WrappedLogger,  # noqa: ARG001
    method_name: str,  # noqa: ARG001
    event_dict: EventDict,
) -> EventDict:
    """Inject static application context into every log record."""
    settings = get_settings()
    event_dict["app"] = settings.APP_NAME
    event_dict["version"] = settings.APP_VERSION
    event_dict["env"] = settings.APP_ENV
    return event_dict


def configure_logging() -> None:
    """
    Configure structlog once at application startup.
    Idempotent — safe to call multiple times.
    """
    global _CONFIGURED  # noqa: PLW0603
    if _CONFIGURED:
        return

    settings = get_settings()
    log_level_value = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        structlog.processors.StackInfoRenderer(),
        _add_app_context,
    ]

    if settings.LOG_FORMAT == "json":
        renderer: Any = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer(colors=not settings.is_production)

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        processor=renderer,
        foreign_pre_chain=shared_processors,
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level_value)

    # Silence noisy third-party loggers in production
    if settings.is_production:
        for noisy in ("uvicorn.access", "sqlalchemy.engine", "httpx"):
            logging.getLogger(noisy).setLevel(logging.WARNING)

    _CONFIGURED = True


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """
    Returns a named structlog logger.

    Args:
        name: Module name (use __name__).

    Returns:
        A bound structlog logger enriched with application context.
    """
    return structlog.get_logger(name)

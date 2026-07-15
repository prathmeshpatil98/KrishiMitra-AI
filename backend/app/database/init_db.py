"""
KrishiMitra AI — Database Initialisation
==========================================
Purpose     : Bootstrap the database on application startup.
Respons.    : Create all tables (if not present), validate connectivity, and run health check.
Dependencies: SQLAlchemy 2.x, app.database.base, app.database.session
Usage       : Called once in app lifespan — await init_db()

Import all models here to ensure their tables are registered with Base.metadata
before create_all is invoked.
"""

from __future__ import annotations

from sqlalchemy import text

from app.core.logging import get_logger
from app.database.base import Base
from app.database.session import get_engine
import app.models  # noqa: F401

logger = get_logger(__name__)


async def init_db() -> None:
    """
    Initialise the database.

    Steps:
        1. Import all domain models so their tables register with Base.metadata.
        2. Create all tables that do not already exist.
        3. Validate the connection with a simple SELECT 1 query.

    Raises:
        Exception: If the database is unreachable or table creation fails.
    """
    # --- Import all models here so SQLAlchemy registers their tables ---
    # When feature models are created, add their imports here.
    # Example:
    #   from app.models.user import User  # noqa: F401
    #   from app.models.farmer import FarmerProfile  # noqa: F401
    # ---------------------------------------------------------------

    engine = get_engine()

    logger.info("database_init_started")

    try:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)
            logger.info("database_tables_created_or_verified")

            # Validate connectivity
            result = await connection.execute(text("SELECT 1"))
            row = result.scalar_one()
            assert row == 1, "Database connectivity check failed"  # noqa: S101

        logger.info("database_init_completed")
    except Exception as exc:
        logger.error("database_init_failed", error=str(exc), exc_info=True)
        raise


async def check_db_health() -> dict[str, str]:
    """
    Execute a lightweight health probe against the database.

    Returns:
        dict with 'status': 'healthy' | 'unhealthy' and optional 'detail'.
    """
    engine = get_engine()
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception as exc:
        logger.error("database_health_check_failed", error=str(exc))
        return {"status": "unhealthy", "detail": "Database unreachable"}

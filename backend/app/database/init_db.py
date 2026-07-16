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

        # Seed default user if not exists
        from sqlalchemy import select
        from app.models.user import User
        from app.security.hashing import PasswordHasher
        from app.database.session import get_async_session_factory

        session_factory = get_async_session_factory()
        async with session_factory() as session:
            try:
                result = await session.execute(select(User).where(User.email == "farmer@krishimitra.ai"))
                db_user = result.scalar_one_or_none()
                if not db_user:
                    hashed_pwd = PasswordHasher.hash_password("password123")
                    new_user = User(
                        full_name="Pratiksha Tiwari",
                        email="farmer@krishimitra.ai",
                        phone="9999999999",
                        password_hash=hashed_pwd,
                        role="farmer",
                        is_active=True,
                        is_verified=True,
                    )
                    session.add(new_user)
                    await session.commit()
                    logger.info("seeded_default_user", email="farmer@krishimitra.ai")
            except Exception as seed_exc:
                logger.error("database_seeding_failed", error=str(seed_exc))
                await session.rollback()

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

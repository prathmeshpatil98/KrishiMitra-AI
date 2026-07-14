"""
KrishiMitra AI — Alembic Environment Configuration
===================================================
Purpose     : Configure database migrations run dynamically via asyncpg.
Respons.    : Target base metadata, read DB settings, and execute migrations.
Dependencies: Alembic, SQLAlchemy (asyncio), app.core.config, app.database.base, app.models
"""

from __future__ import annotations

import asyncio
import logging
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

# --- Add App Source to System Path ---
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import get_settings
from app.database.base import Base
import app.models  # noqa: F401 (Registers all models with Base.metadata)

# Interpret the config file for Python logging
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

logger = logging.getLogger("alembic.runtime.migration")

# Target database metadata for autogenerate detection
target_metadata = Base.metadata

# Load application settings
settings = get_settings()


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    # Offline needs the connection URL
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:
    """Helper method to run migrations synchronously on connection."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Construct an async engine and run migrations online."""
    connectable = create_async_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

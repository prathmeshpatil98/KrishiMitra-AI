"""
KrishiMitra AI — SQLAlchemy Declarative Base
=============================================
Purpose     : Declare the shared SQLAlchemy metadata and base class.
Respons.    : All ORM models must inherit from `Base` defined here.
Dependencies: SQLAlchemy 2.x
Usage       : from app.database.base import Base
"""

from sqlalchemy.orm import DeclarativeBase, MappedColumn


class Base(DeclarativeBase):
    """
    Declarative base class shared by all KrishiMitra AI ORM models.

    All table models inherit from this class.
    Audit columns (id, created_at, updated_at, etc.) are defined in
    app.models.base.BaseModel — every domain model inherits from that.
    """
    pass

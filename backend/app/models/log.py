"""
KrishiMitra AI — Log & Audit Models
====================================
Purpose     : SQLAlchemy model declarations for tracking execution logs and change audits.
Respons.    : Declare api_logs, agent_logs, external_api_cache, and audit_logs tables.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class APILog(BaseModel):
    """
    APILog records every HTTP API request metrics for analytics and audit.
    """

    __tablename__ = "api_logs"

    endpoint: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Request endpoint path",
    )

    method: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        comment="HTTP method (GET | POST | ...)",
    )

    status_code: Mapped[int] = mapped_column(
        nullable=False,
        comment="HTTP response status code",
    )

    execution_time: Mapped[float] = mapped_column(
        nullable=False,
        comment="Total latency execution duration in milliseconds",
    )

    user_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Reference to user who triggered the request",
    )

    request_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        nullable=True,
        index=True,
        comment="Distributed tracing UUID",
    )

    def __repr__(self) -> str:
        return f"<APILog endpoint={self.endpoint!r} status={self.status_code!r}>"


class AgentLog(BaseModel):
    """
    AgentLog tracks LangGraph AI agent execution paths, token usage, and exceptions.
    """

    __tablename__ = "agent_logs"

    conversation_id: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="Reference to chat conversation",
    )

    agent_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Name of executed LangGraph agent",
    )

    execution_time: Mapped[float] = mapped_column(
        nullable=False,
        comment="Execution duration in milliseconds",
    )

    input_tokens: Mapped[Optional[int]] = mapped_column(
        comment="Number of input/prompt tokens consumed",
    )

    output_tokens: Mapped[Optional[int]] = mapped_column(
        comment="Number of output/generation tokens consumed",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Execution state (SUCCESS | FAILURE)",
    )

    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Traceback message description if failed",
    )

    tool_calls: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Raw log list of tool names and inputs invoked by the agent",
    )

    def __repr__(self) -> str:
        return f"<AgentLog agent={self.agent_name!r} status={self.status!r}>"


class ExternalAPICache(BaseModel):
    """
    ExternalAPICache acts as a database-backed fallback TTL cache for third party API payloads.
    """

    __tablename__ = "external_api_cache"

    provider: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Third party provider (AGMARKNET | Google Maps | OpenWeather)",
    )

    cache_key: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Hashed cache index key string",
    )

    response_json: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        comment="Cached JSON response payload body",
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        comment="Timestamp when cache expires",
    )

    def __repr__(self) -> str:
        return f"<ExternalAPICache provider={self.provider!r} expires={self.expires_at!r}>"


class AuditLog(BaseModel):
    """
    AuditLog records detailed system transactions, edits, and deletions for security checks.
    """

    __tablename__ = "audit_logs"

    entity: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Audit domain entity table name",
    )

    entity_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        comment="Target primary key UUID reference",
    )

    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Transaction categories (INSERT | UPDATE | DELETE)",
    )

    old_value: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Payload details before the change occurred",
    )

    new_value: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Payload details after the change was committed",
    )

    performed_by: Mapped[Optional[str]] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="Reference to user who triggered the change",
    )

    performed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        comment="Timestamp when changes occurred",
    )

    def __repr__(self) -> str:
        return f"<AuditLog entity={self.entity!r} action={self.action!r}>"

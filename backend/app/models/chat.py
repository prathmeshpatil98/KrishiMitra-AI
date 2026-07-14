"""
KrishiMitra AI — Conversation & Message Models
===============================================
Purpose     : SQLAlchemy model declarations for AI conversation histories and LangGraph checkpoints.
Respons.    : Declare conversations, messages, and langgraph_checkpoints tables.
Dependencies: SQLAlchemy 2.x, app.models.base
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Conversation(BaseModel):
    """
    Conversation represents a single AI chat session.
    """

    __tablename__ = "conversations"

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to owner user",
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="New Conversation",
        comment="Auto-generated or user-assigned chat title",
    )

    language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en",
        comment="Language used during the conversation (en | hi | mr)",
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
        comment="Timestamp when conversation was started",
    )

    last_message_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        index=True,
        comment="Timestamp of latest message exchange",
    )

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="conversations")
    messages: Mapped[List[Message]] = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Conversation id={self.id!r} title={self.title!r}>"


class Message(BaseModel):
    """
    Message represents a chat exchange item in a conversation.
    """

    __tablename__ = "messages"

    conversation_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to parent conversation record",
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        comment="Author role (user | assistant | system | agent)",
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Body content of the message",
    )

    token_usage: Mapped[Optional[int]] = mapped_column(
        comment="Token consumption size of prompt + output",
    )

    agent_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        comment="Specific agent name in multi-agent setup (e.g. MarketAgent)",
    )

    # Relationships
    conversation: Mapped[Conversation] = relationship("Conversation", back_populates="messages")

    def __repr__(self) -> str:
        return f"<Message role={self.role!r} agent={self.agent_name!r}>"


class LangGraphCheckpoint(BaseModel):
    """
    LangGraphCheckpoint persists session state values for LangGraph agents.
    """

    __tablename__ = "langgraph_checkpoints"

    thread_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="LangGraph session thread identifier",
    )

    checkpoint_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        comment="LangGraph checkpoint transaction version identifier",
    )

    state_json: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        comment="Nested graph status checkpoints JSON payload data",
    )

    def __repr__(self) -> str:
        return f"<LangGraphCheckpoint thread={self.thread_id!r} checkpoint={self.checkpoint_id!r}>"


# Import stubs to resolve circular dependencies in annotations
from app.models.user import User

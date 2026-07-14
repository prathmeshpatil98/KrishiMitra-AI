"""
KrishiMitra AI — Standard API Response Schemas
================================================
Purpose     : Define the universal API response envelope shared by all endpoints.
Respons.    : Ensure every endpoint returns a consistent, typed JSON structure.
Dependencies: Pydantic v2
Usage       : from app.schemas.base import APISuccessResponse, APIErrorResponse

Every FastAPI route must return one of these types.
Never return raw dicts or arbitrary JSON from routes.
"""

from __future__ import annotations

import time
import uuid
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


def _utc_timestamp() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def _new_request_id() -> str:
    return str(uuid.uuid4())


# =============================================================================
# Success Response
# =============================================================================


class APISuccessResponse(BaseModel, Generic[DataT]):
    """
    Standard success response envelope for all KrishiMitra AI endpoints.

    All fields are always present. Never return naked data objects.

    Example:
        {
            "success": true,
            "message": "Markets retrieved successfully.",
            "data": { ... },
            "timestamp": "2025-01-01T12:00:00Z",
            "request_id": "uuid-here"
        }
    """

    success: bool = True
    message: str = "Request completed successfully."
    data: DataT
    timestamp: str = Field(default_factory=_utc_timestamp)
    request_id: str = Field(default_factory=_new_request_id)

    model_config = {"from_attributes": True}


# =============================================================================
# Error Response
# =============================================================================


class APIErrorResponse(BaseModel):
    """
    Standard error response envelope for all KrishiMitra AI error conditions.

    Example:
        {
            "success": false,
            "message": "Unable to fetch market prices.",
            "error_code": "MARKET_API_TIMEOUT",
            "details": {},
            "timestamp": "2025-01-01T12:00:00Z",
            "request_id": "uuid-here"
        }
    """

    success: bool = False
    message: str
    error_code: str
    details: dict[str, Any] = Field(default_factory=dict)
    timestamp: str = Field(default_factory=_utc_timestamp)
    request_id: str = Field(default_factory=_new_request_id)


# =============================================================================
# Paginated Response
# =============================================================================


class PaginationMeta(BaseModel):
    """Metadata for paginated collection responses."""

    total: int = Field(description="Total number of items matching the query.")
    page: int = Field(description="Current page number (1-indexed).")
    limit: int = Field(description="Number of items per page.")
    total_pages: int = Field(description="Total number of pages.")
    has_next: bool = Field(description="Whether a next page exists.")
    has_previous: bool = Field(description="Whether a previous page exists.")


class PaginatedResponse(BaseModel, Generic[DataT]):
    """
    Paginated collection response.

    Used for list endpoints such as /markets, /notifications, etc.

    Example:
        {
            "success": true,
            "message": "Markets retrieved successfully.",
            "data": [...],
            "pagination": {
                "total": 42,
                "page": 1,
                "limit": 20,
                "total_pages": 3,
                "has_next": true,
                "has_previous": false
            },
            "timestamp": "...",
            "request_id": "..."
        }
    """

    success: bool = True
    message: str = "Request completed successfully."
    data: list[DataT]
    pagination: PaginationMeta
    timestamp: str = Field(default_factory=_utc_timestamp)
    request_id: str = Field(default_factory=_new_request_id)

    @classmethod
    def build(
        cls,
        items: list[DataT],
        total: int,
        page: int,
        limit: int,
        message: str = "Request completed successfully.",
    ) -> "PaginatedResponse[DataT]":
        """
        Convenience factory to construct a PaginatedResponse.

        Args:
            items   : The page of items to return.
            total   : Total matching records in the database.
            page    : Current page (1-indexed).
            limit   : Items per page.
            message : Optional custom message.
        """
        total_pages = max(1, -(-total // limit))  # Ceiling division
        return cls(
            data=items,
            message=message,
            pagination=PaginationMeta(
                total=total,
                page=page,
                limit=limit,
                total_pages=total_pages,
                has_next=page < total_pages,
                has_previous=page > 1,
            ),
        )

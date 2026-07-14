"""
KrishiMitra AI — Custom Exception Hierarchy
============================================
Purpose     : Define all domain-specific exceptions for the KrishiMitra AI platform.
Respons.    : Provide typed, structured exceptions that carry error codes and HTTP status info.
Dependencies: None (pure Python)
Usage       : raise NotFoundError("Market not found", error_code="MARKET_NOT_FOUND")

Every custom exception maps to a specific HTTP status code and error code string.
The global error handler (middleware/error_handler.py) catches and serialises these.
"""

from __future__ import annotations

from typing import Any


class KrishiMitraException(Exception):
    """
    Base exception for all KrishiMitra AI domain errors.

    Attributes:
        message     : Human-readable error description.
        error_code  : Machine-readable error code (e.g. 'MARKET_NOT_FOUND').
        status_code : HTTP status code to return to the client.
        details     : Optional structured details for debugging (never exposed in production).
    """

    status_code: int = 500
    error_code: str = "INTERNAL_ERROR"

    def __init__(
        self,
        message: str = "An unexpected error occurred.",
        error_code: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.error_code = error_code or self.__class__.error_code
        self.details = details or {}
        super().__init__(message)


# =============================================================================
# Authentication & Authorization
# =============================================================================


class AuthenticationError(KrishiMitraException):
    """Raised when a request cannot be authenticated (invalid / expired token)."""

    status_code = 401
    error_code = "INVALID_TOKEN"


class AuthorizationError(KrishiMitraException):
    """Raised when an authenticated user lacks the required role/permission."""

    status_code = 403
    error_code = "INSUFFICIENT_PERMISSIONS"


class TokenExpiredError(AuthenticationError):
    """Raised specifically when a JWT token has expired."""

    error_code = "TOKEN_EXPIRED"


class InvalidCredentialsError(AuthenticationError):
    """Raised when email/password credentials are incorrect."""

    error_code = "INVALID_CREDENTIALS"


# =============================================================================
# Validation
# =============================================================================


class ValidationError(KrishiMitraException):
    """Raised when input data fails business-level validation (beyond Pydantic)."""

    status_code = 422
    error_code = "VALIDATION_ERROR"


class InvalidLocationError(ValidationError):
    """Raised when a provided location cannot be resolved."""

    error_code = "INVALID_LOCATION"


# =============================================================================
# Resource Errors
# =============================================================================


class NotFoundError(KrishiMitraException):
    """Raised when a requested resource does not exist."""

    status_code = 404
    error_code = "NOT_FOUND"


class ConflictError(KrishiMitraException):
    """Raised when a create/update operation conflicts with existing data."""

    status_code = 409
    error_code = "CONFLICT"


# =============================================================================
# External API Errors
# =============================================================================


class ExternalAPIError(KrishiMitraException):
    """Raised when a third-party API call fails."""

    status_code = 502
    error_code = "EXTERNAL_API_ERROR"


class MarketAPIError(ExternalAPIError):
    """Raised when the AGMARKNET / market data API fails."""

    error_code = "MARKET_API_TIMEOUT"


class WeatherAPIError(ExternalAPIError):
    """Raised when the OpenWeather API fails."""

    error_code = "WEATHER_API_TIMEOUT"


class TransportAPIError(ExternalAPIError):
    """Raised when Google Maps / Distance Matrix API fails."""

    error_code = "TRANSPORT_ERROR"


class GovernmentAPIError(ExternalAPIError):
    """Raised when the government schemes API fails."""

    error_code = "GOVERNMENT_API_ERROR"


# =============================================================================
# Database Errors
# =============================================================================


class DatabaseError(KrishiMitraException):
    """Raised when a database operation fails unexpectedly."""

    status_code = 500
    error_code = "DATABASE_ERROR"


# =============================================================================
# AI / LangGraph Errors
# =============================================================================


class LangGraphError(KrishiMitraException):
    """Raised when LangGraph agent execution fails."""

    status_code = 500
    error_code = "LANGGRAPH_ERROR"


class AgentTimeoutError(LangGraphError):
    """Raised when an agent exceeds its allowed execution time."""

    error_code = "AGENT_TIMEOUT"


class PromptInjectionError(KrishiMitraException):
    """Raised when a potentially malicious prompt is detected."""

    status_code = 400
    error_code = "PROMPT_INJECTION_DETECTED"


# =============================================================================
# Rate Limiting
# =============================================================================


class RateLimitError(KrishiMitraException):
    """Raised when a client exceeds the allowed request rate."""

    status_code = 429
    error_code = "RATE_LIMIT_EXCEEDED"

    def __init__(
        self,
        message: str = "Too many requests. Please try again later.",
        retry_after: int = 60,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.retry_after = retry_after
        super().__init__(message=message, details=details)

"""
KrishiMitra AI — JWT Token Service
=====================================
Purpose     : Issue and verify JSON Web Tokens for authentication.
Respons.    : Create access tokens, create refresh tokens, decode and validate tokens.
Dependencies: python-jose, app.core.config, app.core.exceptions
Usage       : from app.security.jwt import TokenService

Never store JWT tokens in the database.
Never log token values.
Prefer HTTP-Only cookies or Secure Storage for token storage.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError

from app.core.config import get_settings
from app.core.exceptions import AuthenticationError, TokenExpiredError
from app.core.logging import get_logger

logger = get_logger(__name__)


class TokenPayload:
    """Typed representation of a decoded JWT payload."""

    __slots__ = ("sub", "role", "jti", "token_type", "exp", "iat")

    def __init__(self, payload: dict[str, Any]) -> None:
        self.sub: str = payload["sub"]
        self.role: str = payload.get("role", "farmer")
        self.jti: str = payload.get("jti", "")
        self.token_type: str = payload.get("type", "access")
        self.exp: datetime = datetime.fromtimestamp(payload["exp"], tz=UTC)
        self.iat: datetime = datetime.fromtimestamp(payload["iat"], tz=UTC)


class TokenService:
    """
    Stateless service for JWT creation and validation.

    Tokens contain:
        sub  : User UUID (string)
        role : UserRole string (farmer | admin | government_officer)
        jti  : Unique token identifier (UUID4) for future blacklisting
        type : 'access' | 'refresh'
        exp  : Expiry timestamp
        iat  : Issued-at timestamp
    """

    @staticmethod
    def create_access_token(
        user_id: str,
        role: str,
        extra_claims: dict[str, Any] | None = None,
    ) -> str:
        """
        Issue a short-lived JWT access token.

        Args:
            user_id     : The user's UUID as a string.
            role        : The user's role string.
            extra_claims: Optional additional claims to embed.

        Returns:
            A signed JWT access token string.
        """
        settings = get_settings()
        now = datetime.now(tz=UTC)
        payload: dict[str, Any] = {
            "sub": user_id,
            "role": role,
            "jti": str(uuid.uuid4()),
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        if extra_claims:
            payload.update(extra_claims)

        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
        logger.debug("access_token_issued", user_id=user_id, role=role)
        return token

    @staticmethod
    def create_refresh_token(user_id: str, role: str) -> str:
        """
        Issue a long-lived JWT refresh token.

        Args:
            user_id : The user's UUID as a string.
            role    : The user's role string.

        Returns:
            A signed JWT refresh token string.
        """
        settings = get_settings()
        now = datetime.now(tz=UTC)
        payload: dict[str, Any] = {
            "sub": user_id,
            "role": role,
            "jti": str(uuid.uuid4()),
            "type": "refresh",
            "iat": now,
            "exp": now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        }
        return jwt.encode(
            payload,
            settings.JWT_REFRESH_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

    @staticmethod
    def decode_access_token(token: str) -> TokenPayload:
        """
        Decode and validate a JWT access token.

        Args:
            token: The raw JWT access token string.

        Returns:
            TokenPayload with decoded claims.

        Raises:
            TokenExpiredError  : If the token has expired.
            AuthenticationError: If the token is invalid or malformed.
        """
        settings = get_settings()
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except ExpiredSignatureError:
            logger.warning("access_token_expired")
            raise TokenExpiredError("Your session has expired. Please log in again.")
        except JWTError as exc:
            logger.warning("access_token_invalid", error=str(exc))
            raise AuthenticationError("Invalid authentication token.")

        if payload.get("type") != "access":
            raise AuthenticationError("Invalid token type — access token required.")

        return TokenPayload(payload)

    @staticmethod
    def decode_refresh_token(token: str) -> TokenPayload:
        """
        Decode and validate a JWT refresh token.

        Args:
            token: The raw JWT refresh token string.

        Returns:
            TokenPayload with decoded claims.

        Raises:
            TokenExpiredError  : If the refresh token has expired.
            AuthenticationError: If the token is invalid.
        """
        settings = get_settings()
        try:
            payload = jwt.decode(
                token,
                settings.JWT_REFRESH_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except ExpiredSignatureError:
            raise TokenExpiredError("Refresh token has expired. Please log in again.")
        except JWTError as exc:
            logger.warning("refresh_token_invalid", error=str(exc))
            raise AuthenticationError("Invalid refresh token.")

        if payload.get("type") != "refresh":
            raise AuthenticationError("Invalid token type — refresh token required.")

        return TokenPayload(payload)

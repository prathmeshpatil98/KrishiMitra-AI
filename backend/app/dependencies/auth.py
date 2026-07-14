"""
KrishiMitra AI — Authentication Dependencies
=============================================
Purpose     : FastAPI dependencies for extracting and validating the authenticated user.
Respons.    : Decode JWT from Authorization header; expose typed current-user context to routes.
Dependencies: FastAPI, app.security.jwt, app.core.exceptions
Usage       :
    async def endpoint(user: CurrentUser = Depends(get_current_active_user)):
        ...

Role enforcement is handled separately in app.security.rbac.
"""

from __future__ import annotations

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import AuthenticationError
from app.core.logging import get_logger
from app.security.jwt import TokenPayload, TokenService

logger = get_logger(__name__)

_bearer_scheme = HTTPBearer(
    scheme_name="Bearer",
    description="JWT access token obtained from POST /api/v1/auth/login",
    auto_error=False,
)


class CurrentUser:
    """
    Typed representation of the currently authenticated user.

    This object is constructed from the decoded JWT payload and is
    injected into route handlers via the get_current_user dependency.

    Attributes:
        user_id  : The user's UUID string.
        role     : The user's role (farmer, admin, government_officer).
        jti      : JWT ID for token identification / future blacklisting.
    """

    __slots__ = ("user_id", "role", "jti")

    def __init__(self, payload: TokenPayload) -> None:
        self.user_id: str = payload.sub
        self.role: str = payload.role
        self.jti: str = payload.jti

    def __repr__(self) -> str:
        return f"<CurrentUser user_id={self.user_id!r} role={self.role!r}>"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),  # noqa: B008
) -> CurrentUser:
    """
    Extract and validate the JWT access token from the Authorization header.

    Args:
        credentials: Bearer token from the Authorization header.

    Returns:
        CurrentUser: Typed object with user_id, role, and jti.

    Raises:
        AuthenticationError: If the token is missing, expired, or invalid.
    """
    if credentials is None:
        raise AuthenticationError(
            "Authentication required. Please provide a valid Bearer token.",
            error_code="MISSING_TOKEN",
        )

    token = credentials.credentials
    payload: TokenPayload = TokenService.decode_access_token(token)
    logger.debug("user_authenticated", user_id=payload.sub, role=payload.role)
    return CurrentUser(payload)


from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.repositories.user import UserRepository

async def get_current_active_user(
    current_user: CurrentUser = Depends(get_current_user),  # noqa: B008
    db: AsyncSession = Depends(get_db),
) -> CurrentUser:
    """
    Extends get_current_user by verifying the user account is still active and exists.
    """
    try:
        repo = UserRepository(db)
        user = await repo.get(current_user.user_id)
        if not user or not user.is_active or user.deleted_at is not None:
            raise AuthenticationError(
                "User account is inactive or has been deactivated.",
                error_code="INACTIVE_USER",
            )
    except Exception as e:
        if isinstance(e, AuthenticationError):
            raise e
        logger.error("get_current_active_user_db_error", error=str(e))
        # Fail safe: if database has a connection issue, we do not bypass authentication checks
        raise AuthenticationError(
            "Authentication failed due to system verification errors.",
            error_code="AUTH_DB_ERROR",
        )
    return current_user

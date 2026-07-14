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


async def get_current_active_user(
    current_user: CurrentUser = Depends(get_current_user),  # noqa: B008
) -> CurrentUser:
    """
    Extends get_current_user by verifying the user account is still active.

    In a full implementation, this would query the database to confirm
    the user's is_active status. That check is added when the User model
    and UserRepository are implemented.

    Args:
        current_user: Injected from get_current_user dependency.

    Returns:
        CurrentUser: The same object if the user is active.

    Raises:
        AuthenticationError: If the user account has been deactivated.
    """
    # TODO(phase-2): Query UserRepository to verify is_active and not soft-deleted.
    # Stubbed here — will be completed when the User feature module is generated.
    return current_user

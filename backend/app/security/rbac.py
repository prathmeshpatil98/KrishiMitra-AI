"""
KrishiMitra AI — Role-Based Access Control (RBAC)
===================================================
Purpose     : Define user roles and role-enforcement FastAPI dependency factories.
Respons.    : Protect endpoints by requiring specific roles; never trust client-supplied roles.
Dependencies: app.core.exceptions
Usage       : @router.get("/admin", dependencies=[Depends(require_role(UserRole.ADMIN))])

Roles are enforced server-side from the JWT payload only.
"""

from __future__ import annotations

from enum import StrEnum
from typing import Callable

from fastapi import Depends

from app.core.exceptions import AuthorizationError
from app.core.logging import get_logger

logger = get_logger(__name__)


class UserRole(StrEnum):
    """
    Enumeration of all roles in the KrishiMitra AI platform.

    New roles must be added here and never assumed from client input.
    """

    FARMER = "farmer"
    ADMIN = "admin"
    GOVERNMENT_OFFICER = "government_officer"


def require_role(*roles: UserRole) -> Callable:
    """
    FastAPI dependency factory that enforces one or more roles.

    The decorated endpoint will only proceed if the current user's role
    is included in the allowed roles set.

    Args:
        *roles: One or more UserRole values that are permitted to access the endpoint.

    Returns:
        A FastAPI dependency callable.

    Usage:
        @router.get(
            "/admin/dashboard",
            dependencies=[Depends(require_role(UserRole.ADMIN))],
        )

    Raises:
        AuthorizationError: If the current user's role is not in the permitted set.
    """
    allowed: frozenset[str] = frozenset(role.value for role in roles)

    async def _check_role(current_user: dict = Depends(_get_current_user_stub)) -> dict:  # noqa: B008
        user_role: str = current_user.get("role", "")
        if user_role not in allowed:
            logger.warning(
                "rbac_access_denied",
                user_role=user_role,
                required_roles=list(allowed),
            )
            raise AuthorizationError(
                f"This action requires one of the following roles: {', '.join(allowed)}.",
                error_code="INSUFFICIENT_PERMISSIONS",
            )
        return current_user

    return _check_role


async def _get_current_user_stub() -> dict:
    """
    Placeholder stub — replaced at runtime by app.dependencies.auth.get_current_user.
    This prevents a circular import between security.rbac and dependencies.auth.
    The real dependency is wired in app.dependencies.auth.
    """
    return {}

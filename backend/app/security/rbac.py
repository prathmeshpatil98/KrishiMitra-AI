"""
KrishiMitra AI — Role-Based Access Control (RBAC)
===================================================
Purpose     : Define user roles and role-enforcement FastAPI dependency factories.
Respons.    : Protect endpoints by requiring specific roles; never trust client-supplied roles.
Dependencies: app.core.exceptions, app.dependencies.auth
Usage       : @router.get("/admin", dependencies=[Depends(require_role(UserRole.ADMIN))])
"""

from __future__ import annotations

from enum import StrEnum
from typing import Callable

from fastapi import Depends

from app.core.exceptions import AuthorizationError
from app.core.logging import get_logger
from app.dependencies.auth import get_current_user, CurrentUser

logger = get_logger(__name__)


class UserRole(StrEnum):
    """
    Enumeration of all roles in the KrishiMitra AI platform.
    """

    FARMER = "farmer"
    ADMIN = "admin"
    GOVERNMENT_OFFICER = "government_officer"


def require_role(*roles: UserRole) -> Callable:
    """
    FastAPI dependency factory that enforces one or more roles.
    """
    allowed: frozenset[str] = frozenset(role.value for role in roles)

    async def _check_role(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        user_role: str = current_user.role
        if user_role not in allowed:
            logger.warning(
                "rbac_access_denied",
                user_id=current_user.user_id,
                user_role=user_role,
                required_roles=list(allowed),
            )
            raise AuthorizationError(
                f"This action requires one of the following roles: {', '.join(allowed)}.",
                error_code="INSUFFICIENT_PERMISSIONS",
            )
        return current_user

    return _check_role

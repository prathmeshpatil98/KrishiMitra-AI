"""
KrishiMitra AI — User Routes
============================
Purpose     : Implement endpoints for fetching profile and demographic details of users.
Respons.    : Expose current-user context, profile settings, and farmer demographics.
Dependencies: FastAPI, app.dependencies.auth, app.repositories.user
"""

from __future__ import annotations

from typing import Any, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AuthenticationError
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, CurrentUser
from app.repositories.user import UserRepository
from app.schemas.base import APISuccessResponse

router = APIRouter()

# ── User API Response Schemas ──────────────────────────────────────────────────


class UserProfileResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: str


# ── User Endpoints ────────────────────────────────────────────────────────────


@router.get("/me", response_model=APISuccessResponse[UserProfileResponse])
async def get_my_profile(
    current_user: CurrentUser = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get profile metadata of the currently authenticated active user.
    """
    user_repo = UserRepository(db)
    user_record = await user_repo.get(current_user.user_id)

    if not user_record:
        raise AuthenticationError("User session context is invalid.")

    return APISuccessResponse(
        data=UserProfileResponse(
            id=str(user_record.id),
            full_name=user_record.full_name,
            email=user_record.email,
            phone=user_record.phone,
            role=user_record.role,
            is_active=user_record.is_active,
            is_verified=user_record.is_verified,
            created_at=user_record.created_at.isoformat(),
        ),
        message="User profile retrieved successfully."
    )

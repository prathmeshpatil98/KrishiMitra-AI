"""
KrishiMitra AI — Authentication Routes
=======================================
Purpose     : Implement user registration, login, token refresh, and logout HTTP handlers.
Respons.    : Validate user credentials, issue secure JWTs, and handle user sign-out.
Dependencies: FastAPI, app.security.jwt, app.security.hashing, app.repositories.user
"""

from __future__ import annotations

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AuthenticationError
from app.core.logging import get_logger
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, CurrentUser
from app.models.user import User
from app.repositories.user import UserRepository
from app.security.hashing import PasswordHasher
from app.security.jwt import TokenService
from app.schemas.base import APISuccessResponse

logger = get_logger(__name__)
router = APIRouter()

# ── Request / Response Schemas ────────────────────────────────────────────────


class UserRegisterInput(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="User's full name")
    email: EmailStr = Field(..., description="Unique email address")
    phone: str = Field(..., description="Unique mobile number")
    password: str = Field(..., min_length=8, description="Strong password (minimum 8 characters)")
    role: str = Field("farmer", pattern="^(farmer|admin|government_officer)$", description="User role")


class UserLoginInput(BaseModel):
    username: str = Field(..., description="Email or phone number")
    password: str = Field(..., description="User password")


class RefreshTokenInput(BaseModel):
    refresh_token: str = Field(..., description="Valid refresh token")


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    role: str
    full_name: str


# ── Auth Endpoints ──────────────────────────────────────────────────────────


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=APISuccessResponse[TokenResponse])
async def register(
    payload: UserRegisterInput,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Register a new user account (Farmer, Admin, or Government Officer) and return credentials.
    """
    logger.info("user_registration_attempt", email=payload.email, phone=payload.phone)
    user_repo = UserRepository(db)

    # 1. Verify email uniqueness
    existing_user = await user_repo.get_by_email(payload.email)
    if existing_user:
        raise AuthenticationError("A user with this email address already exists.")

    # 2. Verify phone uniqueness
    existing_phone = await user_repo.get_by_phone(payload.phone)
    if existing_phone:
        raise AuthenticationError("A user with this phone number already exists.")

    # 3. Create user entity with hashed password
    hashed_pwd = PasswordHasher.hash_password(payload.password)
    user_record = await user_repo.create(
        User(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            password_hash=hashed_pwd,
            role=payload.role,
            is_active=True,
            is_verified=False,
        )
    )

    # 4. Generate JWT access and refresh tokens
    user_id_str = str(user_record.id)
    access_token = TokenService.create_access_token(user_id_str, user_record.role)
    refresh_token = TokenService.create_refresh_token(user_id_str, user_record.role)

    logger.info("user_registration_success", user_id=user_id_str, role=user_record.role)

    return APISuccessResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user_record.role,
            full_name=user_record.full_name,
        ),
        message="User account registered successfully."
    )


@router.post("/login", response_model=APISuccessResponse[TokenResponse])
async def login(
    payload: UserLoginInput,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Authenticate a user using their email/phone credentials and return JWT tokens.
    """
    logger.info("user_login_attempt", username=payload.username)
    user_repo = UserRepository(db)

    # 1. Fetch user by email or phone
    user_record = None
    if "@" in payload.username:
        user_record = await user_repo.get_by_email(payload.username)
    else:
        user_record = await user_repo.get_by_phone(payload.username)

    # 2. Verify credentials
    if not user_record or not PasswordHasher.verify_password(payload.password, user_record.password_hash):
        logger.warning("user_login_failed_credentials", username=payload.username)
        raise AuthenticationError("Invalid login credentials.")

    if not user_record.is_active:
        raise AuthenticationError("Your user account has been deactivated.")

    # 3. Generate tokens
    user_id_str = str(user_record.id)
    access_token = TokenService.create_access_token(user_id_str, user_record.role)
    refresh_token = TokenService.create_refresh_token(user_id_str, user_record.role)

    logger.info("user_login_success", user_id=user_id_str, role=user_record.role)

    return APISuccessResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user_record.role,
            full_name=user_record.full_name,
        ),
        message="Logged in successfully."
    )


@router.post("/refresh", response_model=APISuccessResponse[TokenResponse])
async def refresh_tokens(
    payload: RefreshTokenInput,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Rotate JWT access and refresh tokens using a valid refresh token.
    """
    logger.info("token_refresh_attempt")

    # 1. Decode and validate refresh token
    decoded = TokenService.decode_refresh_token(payload.refresh_token)

    # 2. Verify user exists and is active
    user_repo = UserRepository(db)
    user_record = await user_repo.get(decoded.sub)
    if not user_record or not user_record.is_active:
        raise AuthenticationError("Authenticated user not found or deactivated.")

    # 3. Issue new tokens
    user_id_str = str(user_record.id)
    access_token = TokenService.create_access_token(user_id_str, user_record.role)
    new_refresh_token = TokenService.create_refresh_token(user_id_str, user_record.role)

    logger.info("token_refresh_success", user_id=user_id_str)

    return APISuccessResponse(
        data=TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            role=user_record.role,
            full_name=user_record.full_name,
        ),
        message="Authentication tokens rotated successfully."
    )


@router.post("/logout")
async def logout(
    current_user: CurrentUser = Depends(get_current_user),
) -> Any:
    """
    Invalidate the current user's session (stateless logout).
    In database-backed tokens registries, this would blacklist the current JTI.
    """
    logger.info("user_logout", user_id=current_user.user_id)
    return APISuccessResponse(
        data={"jti": current_user.jti},
        message="Logged out successfully."
    )

"""
KrishiMitra AI — Core Configuration
====================================
Purpose    : Centralised Pydantic Settings loading all configuration from environment variables.
Respons.   : Validate & expose every configurable value across the entire backend application.
Dependencies: pydantic-settings, python-dotenv
Usage      : from app.core.config import get_settings; settings = get_settings()

Never hardcode secrets. All values come from .env or environment.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, PostgresDsn, RedisDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralised application settings loaded from environment variables.
    Fails fast on startup if any required field is missing.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # -------------------------------------------------------------------------
    # Application
    # -------------------------------------------------------------------------
    APP_NAME: str = "KrishiMitra AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    TIMEZONE: str = "Asia/Kolkata"

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"

    # -------------------------------------------------------------------------
    # FastAPI
    # -------------------------------------------------------------------------
    API_PREFIX: str = "/api/v1"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1

    # -------------------------------------------------------------------------
    # Database (PostgreSQL via asyncpg)
    # -------------------------------------------------------------------------
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "krishimitra"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = Field(default=..., description="PostgreSQL password — required")
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30

    @property
    def DATABASE_URL(self) -> str:  # noqa: N802
        return (
            f"postgresql+asyncpg://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    @property
    def ALEMBIC_DATABASE_URL(self) -> str:  # noqa: N802
        """Synchronous URL for Alembic migrations."""
        return (
            f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    # -------------------------------------------------------------------------
    # Redis
    # -------------------------------------------------------------------------
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0

    @property
    def REDIS_URL(self) -> str:  # noqa: N802
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # -------------------------------------------------------------------------
    # JWT Authentication
    # -------------------------------------------------------------------------
    JWT_SECRET_KEY: str = Field(default=..., description="JWT secret key — min 64 chars")
    JWT_REFRESH_SECRET_KEY: str = Field(default=..., description="JWT refresh secret key — min 64 chars")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    @field_validator("JWT_SECRET_KEY", "JWT_REFRESH_SECRET_KEY")
    @classmethod
    def jwt_secrets_must_be_strong(cls, value: str, info: object) -> str:
        if len(value) < 32:
            raise ValueError(f"{info.field_name} must be at least 32 characters long.")
        return value

    # -------------------------------------------------------------------------
    # LangGraph
    # -------------------------------------------------------------------------
    LANGGRAPH_CHECKPOINTER: str = "postgres"
    LANGGRAPH_THREAD_TIMEOUT: int = 300
    LANGGRAPH_MAX_ITERATIONS: int = 15

    # -------------------------------------------------------------------------
    # LangSmith Tracing
    # -------------------------------------------------------------------------
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: str = ""
    LANGCHAIN_PROJECT: str = "KrishiMitra AI"
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"

    # -------------------------------------------------------------------------
    # LLM Providers
    # -------------------------------------------------------------------------
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_TEMPERATURE: float = 0.2
    OPENAI_MAX_TOKENS: int = 4000

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-pro"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"

    # -------------------------------------------------------------------------
    # External APIs
    # -------------------------------------------------------------------------
    AGMARKNET_API_KEY: str = ""
    AGMARKNET_BASE_URL: str = "https://agmarknet.gov.in/api"

    GOOGLE_MAPS_API_KEY: str = ""
    GOOGLE_GEOCODING_API_KEY: str = ""
    GOOGLE_DISTANCE_MATRIX_API_KEY: str = ""
    GOOGLE_PLACES_API_KEY: str = ""

    OPENWEATHER_API_KEY: str = ""
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"

    GOVERNMENT_API_URL: str = ""
    GOVERNMENT_API_KEY: str = ""

    # -------------------------------------------------------------------------
    # Voice AI
    # -------------------------------------------------------------------------
    WHISPER_MODEL: str = "large-v3"
    ELEVENLABS_API_KEY: str = ""
    GOOGLE_TTS_API_KEY: str = ""

    # -------------------------------------------------------------------------
    # Email (SMTP)
    # -------------------------------------------------------------------------
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    # -------------------------------------------------------------------------
    # CORS
    # -------------------------------------------------------------------------
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    CORS_ALLOW_CREDENTIALS: bool = True

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]

    # -------------------------------------------------------------------------
    # Rate Limiting
    # -------------------------------------------------------------------------
    RATE_LIMIT_PER_MINUTE: int = 60
    AUTH_RATE_LIMIT: int = 10

    # -------------------------------------------------------------------------
    # Cache TTLs (seconds)
    # -------------------------------------------------------------------------
    CACHE_TTL_MARKET: int = 300
    CACHE_TTL_WEATHER: int = 600
    CACHE_TTL_SCHEMES: int = 86400

    # -------------------------------------------------------------------------
    # File Uploads
    # -------------------------------------------------------------------------
    MAX_UPLOAD_SIZE_MB: int = 20
    UPLOAD_DIRECTORY: str = "uploads"

    # -------------------------------------------------------------------------
    # Feature Flags
    # -------------------------------------------------------------------------
    ENABLE_VOICE: bool = True
    ENABLE_STREAMING: bool = True
    ENABLE_ANALYTICS: bool = False
    ENABLE_DEBUG_PANEL: bool = False
    ENABLE_HTTPS: bool = False
    ENABLE_SWAGGER: bool = True

    # -------------------------------------------------------------------------
    # Monitoring
    # -------------------------------------------------------------------------
    SENTRY_DSN: str = ""
    ENABLE_METRICS: bool = True

    # -------------------------------------------------------------------------
    # Logging
    # -------------------------------------------------------------------------
    LOG_FORMAT: str = "json"
    ENABLE_REQUEST_LOGGING: bool = True


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Returns a cached singleton instance of Settings.
    Called once on application startup; subsequent calls return the cached instance.
    """
    return Settings()

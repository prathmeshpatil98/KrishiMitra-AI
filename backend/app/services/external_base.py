"""
KrishiMitra AI — Base External API Service
============================================
Purpose     : Implement the foundation client class for all external integrations.
Respons.    : Manage HTTPX async sessions, retry rules via Tenacity, timeouts, and DB caching.
Dependencies: httpx, tenacity, app.core.config, app.database.session
"""

from __future__ import annotations

from datetime import datetime, timedelta, UTC
from typing import Any, Dict, Optional
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError
from app.models.log import ExternalAPICache

logger = get_logger(__name__)
settings = get_settings()


class BaseExternalService:
    """
    Abstract base service providing shared logic for external API clients.
    Handles HTTPX requests, tenacity retries, custom timeouts, and database caching.
    """

    def __init__(self, base_url: str, timeout: float = 10.0) -> None:
        self.base_url = base_url
        self.timeout = timeout
        self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def close(self) -> None:
        """Close the internal HTTPX client session."""
        await self._client.aclose()

    @retry(
        retry=retry_if_exception_type((httpx.RequestError, httpx.HTTPStatusError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def _request_with_retry(
        self,
        method: str,
        url: str,
        **kwargs: Any,
    ) -> httpx.Response:
        """
        Execute an HTTP request with automatic exponential backoff retries.
        """
        logger.debug("external_request_attempt", method=method, url=url)
        response = await self._client.request(method, url, **kwargs)
        response.raise_for_status()
        return response

    async def _get_cached_response(
        self,
        db: AsyncSession,
        cache_key: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch active cached API response payload from database cache table.
        """
        stmt = select(ExternalAPICache).where(
            ExternalAPICache.cache_key == cache_key,
            ExternalAPICache.expires_at > datetime.now(UTC),
            ExternalAPICache.deleted_at.is_(None)
        )
        result = await db.execute(stmt)
        cache_record = result.scalar_one_or_none()
        if cache_record:
            logger.debug("external_api_cache_hit", cache_key=cache_key)
            return cache_record.response_json
        return None

    async def _set_cached_response(
        self,
        db: AsyncSession,
        provider: str,
        cache_key: str,
        response_json: Dict[str, Any],
        ttl_seconds: int,
    ) -> None:
        """
        Save API response payload to the database cache table with TTL.
        """
        expires_at = datetime.now(UTC) + timedelta(seconds=ttl_seconds)

        # Upsert: check if key already exists (even if expired)
        stmt = select(ExternalAPICache).where(ExternalAPICache.cache_key == cache_key)
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.response_json = response_json
            existing.expires_at = expires_at
            existing.deleted_at = None
        else:
            new_cache = ExternalAPICache(
                provider=provider,
                cache_key=cache_key,
                response_json=response_json,
                expires_at=expires_at,
            )
            db.add(new_cache)

        await db.commit()
        logger.debug("external_api_cache_saved", cache_key=cache_key, ttl=ttl_seconds)

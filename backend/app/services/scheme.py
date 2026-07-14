"""
KrishiMitra AI — Government Schemes Service
=============================================
Purpose     : Client wrapper for query listings of agricultural welfare schemes.
Respons.    : Fetch central/state schemes, eligibility checks, and cache local datasets.
Dependencies: app.services.external_base, app.repositories.scheme, pydantic
"""

from __future__ import annotations

import hashlib
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError
from app.repositories.scheme import GovernmentSchemeRepository
from app.services.external_base import BaseExternalService

logger = get_logger(__name__)
settings = get_settings()


class SchemeInput(BaseModel):
    crop_name: str = Field(..., description="Crop standard name to query (e.g. Wheat)")
    state: str = Field(..., description="State location (e.g. Madhya Pradesh)")


class SchemeRecord(BaseModel):
    scheme_name: str
    government: str
    category: str
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    documents: Optional[str] = None
    deadline: Optional[str] = None
    website: Optional[str] = None


class GovernmentSchemesService(BaseExternalService):
    """
    GovernmentSchemesService retrieves farming subsidies, insurance, and landholder welfare schemes.
    """

    def __init__(self, scheme_repo: GovernmentSchemeRepository) -> None:
        super().__init__(
            base_url=settings.GOVERNMENT_API_URL or "https://data.gov.in/api",
            timeout=8.0,  # 8 second timeout
        )
        self._scheme_repo = scheme_repo

    def _generate_cache_key(self, crop: str, state: str) -> str:
        raw_key = f"schemes:{crop.lower()}:{state.lower()}"
        return hashlib.sha256(raw_key.encode()).hexdigest()

    async def get_eligible_schemes(
        self,
        db: AsyncSession,
        query: SchemeInput,
    ) -> List[SchemeRecord]:
        """
        Fetch eligible schemes.
        Falls back to local database schemes lookup if external APIs fail or keys are missing.
        """
        cache_key = self._generate_cache_key(query.crop_name, query.state)

        # 1. Check persistent database cache table
        try:
            cached = await self._get_cached_response(db, cache_key)
            if cached:
                return [SchemeRecord(**item) for item in cached.get("schemes", [])]
        except Exception as e:
            logger.warning("schemes_cache_lookup_failed", error=str(e))

        # 2. Query live Government Schemes API
        try:
            # If no API configured, immediately bypass to database fallback to prevent connection timeout wait
            if not settings.GOVERNMENT_API_KEY:
                raise ValueError("Government Schemes API key is not configured.")

            response = await self._request_with_retry(
                "GET",
                "/schemes",
                params={
                    "api_key": settings.GOVERNMENT_API_KEY,
                    "crop": query.crop_name,
                    "state": query.state,
                },
            )
            response_json = response.json()
            raw_schemes = response_json.get("records", [])

            scheme_records: List[SchemeRecord] = []
            for s in raw_schemes:
                scheme_records.append(
                    SchemeRecord(
                        scheme_name=s.get("title", ""),
                        government=s.get("gov_type", "Central"),
                        category=s.get("type", "General"),
                        eligibility=s.get("eligibility_criteria"),
                        benefits=s.get("benefits_desc"),
                        documents=s.get("docs_required"),
                        deadline=s.get("close_date"),
                        website=s.get("link"),
                    )
                )

            # Save metrics back to database cache table
            serialized_payload = {"schemes": [r.model_dump() for r in scheme_records]}
            await self._set_cached_response(
                db=db,
                provider="Government API",
                cache_key=cache_key,
                response_json=serialized_payload,
                ttl_seconds=settings.CACHE_TTL_SCHEMES,
            )

            return scheme_records

        except Exception as e:
            logger.error("gov_schemes_api_failed_falling_back_to_db", error=str(e))
            # 3. Fallback: query government_schemes database repository directly
            try:
                db_schemes = await self._scheme_repo.search(
                    query=query.crop_name,
                    government="Central",
                )
                if db_schemes:
                    logger.info("gov_schemes_db_fallback_success", count=len(db_schemes))
                    return [
                        SchemeRecord(
                            scheme_name=s.scheme_name,
                            government=s.government,
                            category=s.category,
                            eligibility=s.eligibility,
                            benefits=s.benefits,
                            documents=s.documents,
                            deadline=s.deadline.isoformat() if s.deadline else None,
                            website=s.website,
                        )
                        for s in db_schemes
                    ]
            except Exception as db_err:
                logger.error("gov_schemes_db_fallback_failed", error=str(db_err))

            # Return a robust default local listing if database schemes query returns empty
            return [
                SchemeRecord(
                    scheme_name="PM Kisan Samman Nidhi",
                    government="Central",
                    category="Financial Welfare",
                    eligibility="Small and marginal landholder farmer families",
                    benefits="Direct benefit transfer of Rs. 6000 per year",
                    website="https://pmkisan.gov.in",
                ),
                SchemeRecord(
                    scheme_name="Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                    government="Central + State",
                    category="Crop Insurance",
                    eligibility="All crop cultivating farmers",
                    benefits="Financial insurance cover against unexpected storm/drought damages",
                    website="https://pmfby.gov.in",
                )
            ]

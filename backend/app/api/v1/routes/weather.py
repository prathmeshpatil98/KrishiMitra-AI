"""
KrishiMitra AI — Weather Routes
==============================
Purpose     : Expose weather lookup API endpoints.
Respons.    : Fetch current weather data from the tool registry for a location.
Dependencies: FastAPI, Pydantic, app.graph.tools.registry, app.schemas.base
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.exceptions import ExternalAPIError
from app.graph.tools.registry import get_weather
from app.schemas.base import APISuccessResponse

router = APIRouter()


class WeatherQuery(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")


@router.post("/current", response_model=APISuccessResponse[dict[str, Any]])
async def fetch_weather(payload: WeatherQuery) -> Any:
    try:
        weather = await get_weather.ainvoke(payload.model_dump())
        return APISuccessResponse(data=weather, message="Weather data retrieved successfully.")
    except ExternalAPIError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve weather data at this time.",
        ) from exc


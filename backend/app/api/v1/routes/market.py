"""
KrishiMitra AI — Market Routes
=============================
Purpose     : Expose market price lookup API endpoints.
Respons.    : Fetch live prices from the tool registry and return them as structured JSON.
Dependencies: FastAPI, Pydantic, app.graph.tools.registry, app.schemas.base
"""

from __future__ import annotations

from typing import Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.exceptions import ExternalAPIError
from app.graph.tools.registry import get_market_prices
from app.schemas.base import APISuccessResponse

router = APIRouter()


class MarketPriceQuery(BaseModel):
    crop_name: str = Field(..., description="Crop or commodity name, e.g. Tomato, Potato")
    state: str = Field(..., description="State name, e.g. Maharashtra")
    district: Optional[str] = Field(None, description="Optional district name")


@router.post("/prices", response_model=APISuccessResponse[list[dict[str, Any]]])
async def fetch_market_prices(payload: MarketPriceQuery) -> Any:
    try:
        prices = await get_market_prices.ainvoke(payload.model_dump())
        return APISuccessResponse(data=prices, message="Market prices retrieved successfully.")
    except ExternalAPIError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve market prices at this time.",
        ) from exc


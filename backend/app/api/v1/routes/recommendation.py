"""
KrishiMitra AI — Recommendation Routes
=====================================
Purpose     : Expose AI advisor endpoints for realistic crop price and transport recommendations.
Respons.    : Run the compiled LangGraph workflow and return structured advisory output.
Dependencies: FastAPI, Pydantic, langchain_core.messages, app.graph, app.schemas.base
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage

from app.graph import graph
from app.core.logging import get_logger
from app.schemas.base import APISuccessResponse

logger = get_logger(__name__)
router = APIRouter()


class RecommendationRequest(BaseModel):
    crop: str = Field(..., description="Crop name, e.g. Tomato, Potato, Apple")
    quantity: float = Field(..., gt=0, description="Quantity in quintals")
    state: str = Field(..., description="State name, e.g. Maharashtra")
    district: Optional[str] = Field(None, description="District name")
    latitude: Optional[float] = Field(None, description="Latitude of the farm")
    longitude: Optional[float] = Field(None, description="Longitude of the farm")
    language: str = Field("en", pattern="^(en|hi|mr)$", description="Response language: en, hi, or mr")
    query: Optional[str] = Field(None, description="Optional natural language guidance request")


class RecommendationResponse(BaseModel):
    recommendation: Dict[str, Any]


@router.post("", response_model=APISuccessResponse[RecommendationResponse])
async def generate_recommendation(payload: RecommendationRequest) -> Any:
    request_id = str(uuid.uuid4())
    location: Dict[str, Any] = {
        "state": payload.state,
        "district": payload.district or "",
        "latitude": payload.latitude if payload.latitude is not None else 22.7196,
        "longitude": payload.longitude if payload.longitude is not None else 75.8577,
    }
    user_message = payload.query or f"Recommend the best mandi and timing for {payload.quantity} quintals of {payload.crop}."
    graph_input = {
        "user_id": "anonymous",
        "language": payload.language,
        "crop": payload.crop,
        "quantity": payload.quantity,
        "location": location,
        "messages": [HumanMessage(content=user_message)],
        "next_agents": ["market", "weather", "transport", "government", "historical"],
        "request_id": request_id,
    }

    try:
        result = await graph.ainvoke(
            graph_input,
            config={"configurable": {"thread_id": request_id}},
        )
        response_payload = {
            "final_response": result.get("final_response"),
            "decision": result.get("decision"),
            "market_prices": result.get("market_prices"),
            "weather": result.get("weather"),
            "distance_data": result.get("distance_data"),
            "government_schemes": result.get("government_schemes"),
            "confidence_score": result.get("confidence_score"),
            "confidence_explanation": result.get("confidence_explanation"),
            "request_id": result.get("request_id") or request_id,
        }
        return APISuccessResponse(
            data={"recommendation": response_payload},
            message="AI advisor generated recommendation successfully.",
        )
    except Exception as exc:
        logger.error("recommendation_generation_failed", error=str(exc), request_id=request_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate recommendation. Please try again later.",
        ) from exc


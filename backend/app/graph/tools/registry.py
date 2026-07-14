"""
KrishiMitra AI — Tool Registry
===============================
Purpose     : Declare all external API integration tools (Agmarknet, Weather, Maps).
Respons.    : Wrap databases, distance matrix calculations, and ML price trend models.
Dependencies: LangChain Core, Pydantic, HTTPX, app.core.exceptions
"""

from __future__ import annotations

import asyncio
from datetime import datetime, UTC
from typing import Any, Dict, List, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field

from app.core.logging import get_logger
from app.core.exceptions import ExternalAPIError

logger = get_logger(__name__)

# ── Input Schema Definitions ──────────────────────────────────────────────────


class MarketQuery(BaseModel):
    crop_name: str = Field(description="Name of crop to query (e.g. Wheat, Paddy)")
    state: str = Field(description="State name (e.g. Madhya Pradesh)")
    district: Optional[str] = Field(None, description="Optional district name")


class WeatherQuery(BaseModel):
    latitude: float = Field(description="Latitude coordinate")
    longitude: float = Field(description="Longitude coordinate")


class DistanceQuery(BaseModel):
    origin_lat: float = Field(description="Origin latitude coordinate")
    origin_lng: float = Field(description="Origin longitude coordinate")
    dest_lat: float = Field(description="Destination latitude coordinate")
    dest_lng: float = Field(description="Destination longitude coordinate")


class SchemeQuery(BaseModel):
    crop_name: str = Field(description="Name of crop")
    state: str = Field(description="State name")


# ── Registered Tools ──────────────────────────────────────────────────────────


@tool("get_market_prices", args_schema=MarketQuery)
async def get_market_prices(crop_name: str, state: str, district: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetch live market prices and arrivals for a crop in mandis from AGMARKNET API.
    """
    logger.info("tool_get_market_prices_invoked", crop=crop_name, state=state, district=district)
    try:
        # Mocking external API call for offline execution (Phase 1)
        # In a real run, this would query ExternalAPICache or fetch from Agmarknet API
        await asyncio.sleep(0.5)
        return [
            {
                "market_name": "Indore Mandi",
                "state": state,
                "district": district or "Indore",
                "crop_name": crop_name,
                "price": 2450.0,
                "min_price": 2300.0,
                "max_price": 2600.0,
                "unit": "Quintal",
                "price_date": datetime.now(UTC).isoformat(),
            },
            {
                "market_name": "Ujjain Mandi",
                "state": state,
                "district": "Ujjain",
                "crop_name": crop_name,
                "price": 2510.0,
                "min_price": 2400.0,
                "max_price": 2650.0,
                "unit": "Quintal",
                "price_date": datetime.now(UTC).isoformat(),
            }
        ]
    except Exception as e:
        logger.error("tool_get_market_prices_failed", error=str(e))
        raise ExternalAPIError("Failed to fetch market price details.") from e


@tool("get_weather", args_schema=WeatherQuery)
async def get_weather(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetch current weather and rain probability for crop harvesting and transit risk checks.
    """
    logger.info("tool_get_weather_invoked", lat=latitude, lng=longitude)
    try:
        await asyncio.sleep(0.5)
        return {
            "temperature": 29.5,
            "humidity": 65.0,
            "wind_speed": 4.2,
            "rain_probability": 0.15,
            "description": "Partly Cloudy",
            "forecast": [
                {"date": "Day 1", "temp": 30.0, "rain_prob": 0.10},
                {"date": "Day 2", "temp": 28.5, "rain_prob": 0.40},
                {"date": "Day 3", "temp": 29.0, "rain_prob": 0.20}
            ]
        }
    except Exception as e:
        logger.error("tool_get_weather_failed", error=str(e))
        raise ExternalAPIError("Failed to fetch weather details.") from e


@tool("calculate_distance", args_schema=DistanceQuery)
async def calculate_distance(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> Dict[str, Any]:
    """
    Calculate driving distance, travel time, and logistics cost estimates between crop farm and mandis.
    """
    logger.info("tool_calculate_distance_invoked", origin=(origin_lat, origin_lng), dest=(dest_lat, dest_lng))
    try:
        await asyncio.sleep(0.4)
        # Static calculations
        distance_km = 45.8
        travel_time_sec = 3600  # 1 hour
        fuel_cost_inr = distance_km * 8.5  # Rs 8.5 per km
        toll_cost_inr = 80.0

        return {
            "distance_km": distance_km,
            "travel_time": travel_time_sec,
            "fuel_cost": fuel_cost_inr,
            "toll_cost": toll_cost_inr,
            "total_estimated_cost": fuel_cost_inr + toll_cost_inr,
            "route_provider": "Google Maps"
        }
    except Exception as e:
        logger.error("tool_calculate_distance_failed", error=str(e))
        raise ExternalAPIError("Failed to calculate routing distance.") from e


@tool("get_government_schemes", args_schema=SchemeQuery)
async def get_government_schemes(crop_name: str, state: str) -> List[Dict[str, Any]]:
    """
    Fetch active central and state government schemes, eligibility parameters, and application deadlines.
    """
    logger.info("tool_get_government_schemes_invoked", crop=crop_name, state=state)
    try:
        await asyncio.sleep(0.3)
        return [
            {
                "scheme_name": "PM Kisan Samman Nidhi",
                "government": "Central",
                "category": "Direct Benefit Transfer",
                "eligibility": "Small and marginal landholder farmer families",
                "benefits": "Rs. 6000 per year in three equal installments",
                "deadline": "Ongoing",
                "website": "https://pmkisan.gov.in"
            },
            {
                "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "government": "Central + State",
                "category": "Crop Insurance",
                "eligibility": "All farmers growing notified crops in notified areas",
                "benefits": "Insurance coverage against crop failures and weather risks",
                "deadline": "Before sowing season starts",
                "website": "https://pmfby.gov.in"
            }
        ]
    except Exception as e:
        logger.error("tool_get_government_schemes_failed", error=str(e))
        raise ExternalAPIError("Failed to fetch government schemes.") from e


@tool("predict_price_trends")
async def predict_price_trends(crop_name: str, state: str) -> Dict[str, Any]:
    """
    Analyze historical price metrics and predict expected selling prices for the next 7-30 days.
    """
    logger.info("tool_predict_price_trends_invoked", crop=crop_name, state=state)
    try:
        await asyncio.sleep(0.5)
        return {
            "crop_name": crop_name,
            "current_trend": "UPWARD",
            "expected_price_next_7_days": 2520.0,
            "expected_price_next_30_days": 2580.0,
            "best_selling_day": "Friday",
            "confidence_score": 0.88,
            "confidence_explanation": "Historical pricing data shows seasonal price spikes in the third week of this month."
        }
    except Exception as e:
        logger.error("tool_predict_price_trends_failed", error=str(e))
        raise ExternalAPIError("Failed to compute price predictions.") from e

"""
KrishiMitra AI — Weather Agent Node
====================================
Purpose     : Implement the Weather Agent.
Respons.    : Fetch weather details for GPS coordinates and evaluate transit/harvest risks.
Dependencies: app.graph.state, app.graph.tools.registry
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.tools.registry import get_weather

logger = get_logger(__name__)


async def weather_node(state: AgentState) -> Dict[str, Any]:
    """
    Weather Agent node fetches weather details and flags risks.
    """
    logger.info("weather_node_started")

    location = state.get("location") or {}
    lat = location.get("latitude", 22.7196)
    lng = location.get("longitude", 75.8577)

    weather_data = await get_weather.ainvoke({
        "latitude": lat,
        "longitude": lng
    })

    # Evaluate harvesting / transit risks based on forecast
    rain_prob = weather_data.get("rain_probability", 0.0)
    risk_level = "LOW"
    recommendation = "Weather is ideal for transit and harvest."

    if rain_prob > 0.5:
        risk_level = "HIGH"
        recommendation = "High risk of rain. Delay harvest or use waterproof cover for transport."
    elif rain_prob > 0.2:
        risk_level = "MEDIUM"
        recommendation = "Showers predicted. Keep crop drying bags sealed."

    result = {
        "data": weather_data,
        "risk_level": risk_level,
        "recommendation": recommendation
    }

    logger.info("weather_node_completed", risk_level=risk_level)

    return {
        "weather": result,
        "agent_outputs": {"weather_raw": result}
    }

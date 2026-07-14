"""
KrishiMitra AI — Decision Agent Node
=====================================
Purpose     : Implement the Decision Agent.
Respons.    : Synthesize weather, pricing, transport, and profit results into a final decision.
Dependencies: app.graph.state
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState

logger = get_logger(__name__)


async def decision_node(state: AgentState) -> Dict[str, Any]:
    """
    Decision Agent compiles outputs, determines risk levels, and calculates confidence.
    """
    logger.info("decision_node_started")

    profit_ranking = state.get("profit_ranking") or []
    weather_risk = (state.get("weather") or {}).get("risk_level", "LOW")
    weather_advice = (state.get("weather") or {}).get("recommendation", "")
    historical = state.get("agent_outputs", {}).get("historical_raw", {})

    if not profit_ranking:
        return {
            "decision": {
                "success": False,
                "error": "No market price or routing calculations available to form a decision."
            },
            "confidence_score": 0.0,
        }

    best_option = profit_ranking[0]
    best_market = best_option["market_name"]
    expected_profit = best_option["net_profit"]

    # Simple rule-based decision synthesis (wired to LLM in Phase 2)
    confidence = 0.95 if weather_risk == "LOW" else 0.75
    explanation = (
        "Confidence is high because mandi prices and weather data are current, "
        "and logistics costs are calculated via Google Maps."
        if weather_risk == "LOW"
        else "Confidence is reduced due to weather warnings affecting transport."
    )

    decision_summary = {
        "success": True,
        "best_market": best_market,
        "expected_net_profit": expected_profit,
        "recommended_selling_day": historical.get("best_selling_day", "Friday"),
        "weather_risk_status": weather_risk,
        "weather_advice": weather_advice,
        "reasoning": (
            f"Selling in {best_market} yields the highest net profit of Rs. {expected_profit:,.2f} "
            f"after accounting for transport costs (Rs. {best_option['transport_cost']:,.2f}) "
            f"and labor loading fees. The weather risk is {weather_risk}."
        )
    }

    logger.info("decision_node_completed", best_market=best_market, confidence=confidence)

    return {
        "decision": decision_summary,
        "confidence_score": confidence,
        "confidence_explanation": explanation
    }

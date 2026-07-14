"""
KrishiMitra AI — Historical Price Agent Node
==============================================
Purpose     : Implement the Historical Price Agent.
Respons.    : Fetch historical prices, analyze trends, and predict market behaviors.
Dependencies: app.graph.state, app.graph.tools.registry
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.tools.registry import predict_price_trends

logger = get_logger(__name__)


async def historical_node(state: AgentState) -> Dict[str, Any]:
    """
    Historical Price Agent node retrieves trend lines and predicts upcoming prices.
    """
    logger.info("historical_node_started")

    crop = state.get("crop") or "Wheat"
    location = state.get("location") or {}
    state_name = location.get("state", "Madhya Pradesh")

    trend_data = await predict_price_trends.ainvoke({
        "crop_name": crop,
        "state": state_name
    })

    logger.info("historical_node_completed", trend=trend_data.get("current_trend"))

    return {
        "agent_outputs": {"historical_raw": trend_data}
    }

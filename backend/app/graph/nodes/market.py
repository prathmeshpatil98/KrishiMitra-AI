"""
KrishiMitra AI — Market Agent Node
===================================
Purpose     : Implement the Market Agent.
Respons.    : Fetch price statistics and mandi listings for the target crop.
Dependencies: app.graph.state, app.graph.tools.registry
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.tools.registry import get_market_prices

logger = get_logger(__name__)


async def market_node(state: AgentState) -> Dict[str, Any]:
    """
    Market Agent node calls the market prices tool and structures the output.
    """
    logger.info("market_node_started")

    crop = state.get("crop") or "Wheat"
    location = state.get("location") or {}
    state_name = location.get("state", "Madhya Pradesh")
    district = location.get("district")

    # Invoke tool to retrieve prices
    prices = await get_market_prices.ainvoke({
        "crop_name": crop,
        "state": state_name,
        "district": district
    })

    logger.info("market_node_completed", prices_count=len(prices))

    return {
        "market_prices": prices,
        "agent_outputs": {"market_raw": prices}
    }

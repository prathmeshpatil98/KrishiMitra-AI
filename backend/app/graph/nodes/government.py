"""
KrishiMitra AI — Government Agent Node
=======================================
Purpose     : Implement the Government Agent.
Respons.    : Fetch eligible government welfare and insurance schemes for target crops.
Dependencies: app.graph.state, app.graph.tools.registry
"""

from __future__ import annotations

from typing import Any, Dict
from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.tools.registry import get_government_schemes

logger = get_logger(__name__)


async def government_node(state: AgentState) -> Dict[str, Any]:
    """
    Government Agent node fetches eligible schemes.
    """
    logger.info("government_node_started")

    crop = state.get("crop") or "Wheat"
    location = state.get("location") or {}
    state_name = location.get("state", "Madhya Pradesh")

    schemes = await get_government_schemes.ainvoke({
        "crop_name": crop,
        "state": state_name
    })

    logger.info("government_node_completed", schemes_count=len(schemes))

    return {
        "government_schemes": schemes,
        "agent_outputs": {"government_raw": schemes}
    }

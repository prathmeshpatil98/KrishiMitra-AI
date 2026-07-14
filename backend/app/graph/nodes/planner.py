"""
KrishiMitra AI — Planner Node
==============================
Purpose     : Implement the Planner Agent.
Respons.    : Parse user query, extract crop parameters, and schedule specialized agents.
Dependencies: LangGraph, app.graph.state
"""

from __future__ import annotations

from typing import Any, Dict, List
from langchain_core.messages import AIMessage

from app.core.logging import get_logger
from app.graph.state import AgentState

logger = get_logger(__name__)


async def planner_node(state: AgentState) -> Dict[str, Any]:
    """
    Planner Node extracts parameters and sets routing controls.
    """
    logger.info("planner_node_started", request_id=state.get("request_id"))

    # Extract user message content
    user_query = ""
    if state.get("messages"):
        user_query = str(state["messages"][-1].content)

    # Autoparser/Mock extracting parameters for Phase 1 flow
    # This simulates LLM parsing. In Phase 2, this is wired to a structured LLM call.
    crop = state.get("crop") or "Wheat"
    quantity = state.get("quantity") or 50.0
    location = state.get("location") or {
        "state": "Madhya Pradesh",
        "district": "Indore",
        "latitude": 22.7196,
        "longitude": 75.8577,
    }

    # Decide next agents to execute in parallel
    next_agents = ["market", "weather", "transport", "government", "historical"]

    logger.info(
        "planner_node_completed",
        crop=crop,
        quantity=quantity,
        next_agents=next_agents,
    )

    return {
        "crop": crop,
        "quantity": quantity,
        "location": location,
        "next_agents": next_agents,
        "messages": [AIMessage(content="[Planner] Understood. Activating analytical agents...")],
    }

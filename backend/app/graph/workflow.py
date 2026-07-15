"""
KrishiMitra AI — LangGraph Workflow Configuration
==================================================
Purpose     : Assemble nodes, define transition edges, configure memory savers, and compile graph.
Respons.    : Orchestrate parallel MAP execution and REDUCE profit ranking.
Dependencies: LangGraph, app.graph.state, app.graph.nodes
"""

from __future__ import annotations

from typing import Any, List
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.nodes import (
    planner_node,
    market_node,
    weather_node,
    transport_node,
    government_node,
    historical_node,
    profit_node,
    decision_node,
    formatter_node,
)

logger = get_logger(__name__)


def route_planner(state: AgentState) -> List[str]:
    """
    Conditional routing edge evaluating which specialized agents planner wants to invoke.
    All strings returned in this list execute in parallel.
    """
    next_agents = state.get("next_agents") or []
    if not next_agents:
        logger.warning("route_planner_no_agents_fallback")
        return ["profit"]

    # Limit to valid entry graph nodes (market, weather, government, historical)
    # Transport will run sequentially after market node completes
    valid_entry_nodes = {"market", "weather", "government", "historical"}
    routed_branches = [a for a in next_agents if a in valid_entry_nodes]

    logger.info("route_planner_branches_scheduled", branches=routed_branches)
    return routed_branches


def build_workflow() -> StateGraph:
    """
    Construct the StateGraph mapping all KrishiMitra AI agents.
    """
    workflow = StateGraph(AgentState)

    # ── Add Nodes ─────────────────────────────────────────────────────────────
    workflow.add_node("planner", planner_node)
    workflow.add_node("market", market_node)
    workflow.add_node("weather_agent", weather_node)
    workflow.add_node("transport", transport_node)
    workflow.add_node("government", government_node)
    workflow.add_node("historical", historical_node)
    workflow.add_node("profit", profit_node)
    workflow.add_node("decision_agent", decision_node)
    workflow.add_node("formatter", formatter_node)

    # ── Add Edges ─────────────────────────────────────────────────────────────
    workflow.set_entry_point("planner")

    # Conditional branching from planner (runs routed nodes in parallel)
    workflow.add_conditional_edges(
        "planner",
        route_planner,
        {
            "market": "market",
            "weather": "weather_agent",
            "government": "government",
            "historical": "historical",
            "profit": "profit",  # fallback path
        }
    )

    # Sequential chain: market -> transport
    workflow.add_edge("market", "transport")
    workflow.add_edge("transport", "profit")

    # Parallel join/barrier convergence to profit
    workflow.add_edge("weather_agent", "profit")
    workflow.add_edge("government", "profit")
    workflow.add_edge("historical", "profit")

    # Sequence execution towards termination
    workflow.add_edge("profit", "decision_agent")
    workflow.add_edge("decision_agent", "formatter")
    workflow.add_edge("formatter", END)

    return workflow


# Compiled Graph Singleton (uses MemorySaver checkpointer for thread history tracking)
# In production, this can be swapped with PostgresSaver checkpointers.
memory = MemorySaver()
graph = build_workflow().compile(checkpointer=memory)

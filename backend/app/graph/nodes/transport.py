"""
KrishiMitra AI — Transport Agent Node
======================================
Purpose     : Implement the Transport Agent.
Respons.    : Call routing tool for all candidate mandis and aggregate travel distance/cost.
Dependencies: app.graph.state, app.graph.tools.registry
"""

from __future__ import annotations

from typing import Any, Dict, List
from app.core.logging import get_logger
from app.graph.state import AgentState
from app.graph.tools.registry import calculate_distance

logger = get_logger(__name__)


async def transport_node(state: AgentState) -> Dict[str, Any]:
    """
    Transport Agent node computes route options between farm coordinates and target markets.
    """
    logger.info("transport_node_started")

    location = state.get("location") or {}
    origin_lat = location.get("latitude", 22.7196)
    origin_lng = location.get("longitude", 75.8577)

    # Candidate destinations (derived from market node outputs if available)
    markets = state.get("market_prices") or []
    routes: List[Dict[str, Any]] = []

    # Map candidate markets to simulate Google Maps routing matrix
    for m in markets:
        dest_lat = m.get("latitude", origin_lat + 0.1)  # Mock offset
        dest_lng = m.get("longitude", origin_lng + 0.1)

        route = await calculate_distance.ainvoke({
            "origin_lat": origin_lat,
            "origin_lng": origin_lng,
            "dest_lat": dest_lat,
            "dest_lng": dest_lng
        })

        routes.append({
            "market_name": m.get("market_name"),
            "distance_km": route.get("distance_km"),
            "travel_time": route.get("travel_time"),
            "transport_cost": route.get("total_estimated_cost")
        })

    logger.info("transport_node_completed", routes_count=len(routes))

    return {
        "distance_data": {"routes": routes},
        "agent_outputs": {"transport_raw": routes}
    }

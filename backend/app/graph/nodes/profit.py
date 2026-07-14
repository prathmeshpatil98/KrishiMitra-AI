"""
KrishiMitra AI — Profit Agent Node
===================================
Purpose     : Implement the Profit Agent.
Respons.    : Run net profit ranking estimations across candidate mandis.
Dependencies: app.graph.state
"""

from __future__ import annotations

from typing import Any, Dict, List
from app.core.logging import get_logger
from app.graph.state import AgentState

logger = get_logger(__name__)


async def profit_node(state: AgentState) -> Dict[str, Any]:
    """
    Profit Agent node runs formula: Revenue - (Logistics + Commission + Loading) = Net Profit.
    """
    logger.info("profit_node_started")

    quantity = state.get("quantity") or 50.0  # in quintals
    markets = state.get("market_prices") or []
    routes = (state.get("distance_data") or {}).get("routes", [])

    # Map logistics costs by mandi name
    logistics_map = {r["market_name"]: r["transport_cost"] for r in routes if "market_name" in r}

    rankings: List[Dict[str, Any]] = []

    for m in markets:
        market_name = m["market_name"]
        price_per_quintal = m["price"]

        # Commission (approx 2% standard mandi charges)
        gross_revenue = price_per_quintal * quantity
        commission = gross_revenue * 0.02
        loading_cost = quantity * 15.0  # Rs. 15 per quintal labor cost
        transport_cost = logistics_map.get(market_name, gross_revenue * 0.05)  # Fallback 5%

        net_profit = gross_revenue - (transport_cost + commission + loading_cost)

        rankings.append({
            "market_name": market_name,
            "state": m["state"],
            "gross_revenue": gross_revenue,
            "transport_cost": transport_cost,
            "commission_charges": commission,
            "labor_loading_cost": loading_cost,
            "net_profit": net_profit,
            "unit": "INR"
        })

    # Sort by net profit descending
    rankings.sort(key=lambda x: x["net_profit"], reverse=True)

    logger.info("profit_node_completed", best_market=rankings[0]["market_name"] if rankings else "None")

    return {
        "profit_ranking": rankings,
        "agent_outputs": {"profit_raw": rankings}
    }

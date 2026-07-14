"""
KrishiMitra AI — LangGraph Global State
========================================
Purpose     : Define the global typed State schema for the multi-agent execution graph.
Respons.    : Define keys for shared context: farmer profile, crop details, and agent outputs.
Dependencies: LangGraph, Pydantic, typing
"""

from __future__ import annotations

from typing import Annotated, Any, Dict, List, Optional, TypedDict
from langchain_core.messages import BaseMessage


def merge_agent_outputs(left: Dict[str, Any], right: Dict[str, Any]) -> Dict[str, Any]:
    """Reducer function to merge new agent outputs into global agent_outputs dict."""
    merged = left.copy()
    merged.update(right)
    return merged


def merge_messages(left: List[BaseMessage], right: List[BaseMessage]) -> List[BaseMessage]:
    """Reducer function to append new messages to the conversation history."""
    return left + right


class AgentState(TypedDict):
    """
    TypedDict representing the global state shared across all agents in the LangGraph workflow.
    """

    # --- User / Context Inputs ---
    user_id: str
    language: str  # en | hi | mr
    crop: Optional[str]
    quantity: Optional[float]  # in quintals
    location: Optional[Dict[str, Any]]  # state, district, lat, lng

    # --- Conversation Memory ---
    messages: Annotated[List[BaseMessage], merge_messages]

    # --- Plan & Routing Control ---
    next_agents: List[str]  # e.g., ["market", "weather", "transport"]

    # --- Collaborative Agent Outputs (Merged via reducer) ---
    agent_outputs: Annotated[Dict[str, Any], merge_agent_outputs]

    # --- Shared Calculated Insights ---
    market_prices: Optional[List[Dict[str, Any]]]
    weather: Optional[Dict[str, Any]]
    distance_data: Optional[Dict[str, Any]]
    government_schemes: Optional[List[Dict[str, Any]]]
    profit_ranking: Optional[List[Dict[str, Any]]]

    # --- Final Decisions & Formatting ---
    decision: Optional[Dict[str, Any]]
    final_response: Optional[str]

    # --- Metadata & Instrumentation ---
    confidence_score: Optional[float]
    confidence_explanation: Optional[str]
    warnings: List[str]
    request_id: Optional[str]

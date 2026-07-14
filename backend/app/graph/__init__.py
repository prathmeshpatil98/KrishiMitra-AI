"""
KrishiMitra AI — LangGraph Package Export
=========================================
Purpose     : Export compiled multi-agent execution graph.
Respons.    : Expose the compiled workflow graph singleton.
Dependencies: app.graph.workflow
"""

from __future__ import annotations

from app.graph.workflow import graph

__all__ = ["graph"]

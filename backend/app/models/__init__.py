"""
KrishiMitra AI — SQLAlchemy Models Export
=========================================
Purpose     : Single source of truth exposing all domain tables to SQLAlchemy metadata and repositories.
Respons.    : Export User, FarmerProfile, Farm, Crop, Market, MarketPrice, WeatherCache,
              TransportRoute, Recommendation, Conversation, Message, LangGraphCheckpoint,
              GovernmentScheme, Notification, APILog, AgentLog, ExternalAPICache, AuditLog.
Dependencies: app.models.*
"""

from __future__ import annotations

from app.models.base import BaseModel
from app.models.user import User, FarmerProfile
from app.models.farm import Farm, Crop
from app.models.market import Market, MarketPrice
from app.models.weather import WeatherCache
from app.models.transport import TransportRoute
from app.models.recommendation import Recommendation
from app.models.chat import Conversation, Message, LangGraphCheckpoint
from app.models.scheme import GovernmentScheme
from app.models.notification import Notification
from app.models.log import APILog, AgentLog, ExternalAPICache, AuditLog

__all__ = [
    "BaseModel",
    "User",
    "FarmerProfile",
    "Farm",
    "Crop",
    "Market",
    "MarketPrice",
    "WeatherCache",
    "TransportRoute",
    "Recommendation",
    "Conversation",
    "Message",
    "LangGraphCheckpoint",
    "GovernmentScheme",
    "Notification",
    "APILog",
    "AgentLog",
    "ExternalAPICache",
    "AuditLog",
]

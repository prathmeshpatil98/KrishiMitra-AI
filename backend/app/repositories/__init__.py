"""
KrishiMitra AI — Database Repositories Export
=============================================
Purpose     : Single source of truth exposing all domain repositories.
Respons.    : Export AbstractRepository, UserRepository, FarmerProfileRepository,
              FarmRepository, CropRepository, MarketRepository, MarketPriceRepository,
              RecommendationRepository, ConversationRepository, MessageRepository,
              GovernmentSchemeRepository, NotificationRepository.
Dependencies: app.repositories.*
"""

from __future__ import annotations

from app.repositories.base import AbstractRepository
from app.repositories.user import UserRepository, FarmerProfileRepository
from app.repositories.farm import FarmRepository, CropRepository
from app.repositories.market import MarketRepository, MarketPriceRepository
from app.repositories.recommendation import RecommendationRepository
from app.repositories.chat import ConversationRepository, MessageRepository
from app.repositories.scheme import GovernmentSchemeRepository
from app.repositories.notification import NotificationRepository

__all__ = [
    "AbstractRepository",
    "UserRepository",
    "FarmerProfileRepository",
    "FarmRepository",
    "CropRepository",
    "MarketRepository",
    "MarketPriceRepository",
    "RecommendationRepository",
    "ConversationRepository",
    "MessageRepository",
    "GovernmentSchemeRepository",
    "NotificationRepository",
]

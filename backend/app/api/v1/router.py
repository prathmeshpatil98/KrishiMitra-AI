"""
KrishiMitra AI — API v1 Router Aggregation
============================================
Purpose     : Aggregate all v1 route modules into a single router mounted at /api/v1.
Respons.    : Central routing registry — import and include every new feature router here.
Dependencies: FastAPI
Usage       : Mounted in app/main.py via app.include_router(v1_router)

When a new feature module is created, its router must be imported and
included here with the appropriate prefix and tags.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.routes.health import router as health_router

# Feature routers are imported here as they are implemented:
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.user import router as user_router
# from app.api.v1.routes.market import router as market_router
# from app.api.v1.routes.weather import router as weather_router
# from app.api.v1.routes.transport import router as transport_router
# from app.api.v1.routes.recommendation import router as recommendation_router
# from app.api.v1.routes.government import router as government_router
# from app.api.v1.routes.chat import router as chat_router

v1_router = APIRouter()

# Health — always first for monitoring probes
v1_router.include_router(health_router, prefix="/health", tags=["Health"])

# Uncomment as feature modules are implemented:
v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(user_router, prefix="/users", tags=["Users"])
# v1_router.include_router(market_router, prefix="/markets", tags=["Markets"])
# v1_router.include_router(weather_router, prefix="/weather", tags=["Weather"])
# v1_router.include_router(transport_router, prefix="/transport", tags=["Transport"])
# v1_router.include_router(recommendation_router, prefix="/recommendation", tags=["Recommendation"])
# v1_router.include_router(government_router, prefix="/government", tags=["Government Schemes"])
# v1_router.include_router(chat_router, prefix="/chat", tags=["AI Chat"])

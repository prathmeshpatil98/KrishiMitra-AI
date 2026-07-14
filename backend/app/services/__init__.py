"""
KrishiMitra AI — Core Services Export
======================================
Purpose     : Single source of truth exposing all domain services.
Respons.    : Export AbstractService, AGMARKNETService, GoogleMapsService,
              OpenWeatherService, GovernmentSchemesService.
Dependencies: app.services.*
"""

from __future__ import annotations

from app.services.base import AbstractService
from app.services.external_base import BaseExternalService
from app.services.agmarknet import AGMARKNETService
from app.services.maps import GoogleMapsService
from app.services.weather import OpenWeatherService
from app.services.scheme import GovernmentSchemesService

__all__ = [
    "AbstractService",
    "BaseExternalService",
    "AGMARKNETService",
    "GoogleMapsService",
    "OpenWeatherService",
    "GovernmentSchemesService",
]

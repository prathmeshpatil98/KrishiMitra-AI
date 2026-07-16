# KrishiMitra AI Enterprise Backend Blueprint

## Purpose

This document defines the official backend architecture for KrishiMitra AI.

The backend powers an AI-first platform that helps farmers maximize profit by combining:

- Market Prices
- Weather
- Transportation
- Government Schemes
- AI Reasoning (LangGraph)

Every generated Python file MUST follow this blueprint.

Never generate tutorial-level FastAPI code.

Always generate enterprise-quality backend architecture.

---

# Technology Stack

Language

- Python 3.12+

Framework

- FastAPI

ORM

- SQLAlchemy 2.x

Validation

- Pydantic v2

Database

- PostgreSQL

Migrations

- Alembic

Caching

- Redis

Background Jobs

- Celery

Authentication

- JWT

AI

- LangGraph
- LangChain

Observability

- LangSmith

Logging

- Structlog

Testing

- Pytest

---

# Architecture

Follow Clean Architecture.

```

Presentation Layer

↓

API Layer

↓

Service Layer

↓

Repository Layer

↓

Database

```

Every layer has one responsibility.

Never mix responsibilities.

---

# Folder Structure

```

backend/

app/

api/

v1/

routes/

services/

repositories/

agents/

graph/

models/

schemas/

database/

middleware/

security/

config/

core/

prompts/

utils/

dependencies/

workers/

tests/

```

---

# API Layer

The API layer should only

Validate Request

Call Service

Return Response

Nothing else.

Never place business logic inside routes.

Example

```

@router.get("/markets")

↓

MarketService.get_markets()

↓

return response

```

---

# Service Layer

Contains business logic.

Example

```

MarketService

WeatherService

RecommendationService

GovernmentSchemeService

TransportService

VoiceService

```

Services communicate with

Repositories

External APIs

LangGraph

Redis

Never communicate directly with React.

---

# Repository Layer

Repositories are responsible only for

Create

Read

Update

Delete

Search

Nothing else.

Never place AI logic inside repositories.

---

# Models

Each database table has one model.

Example

```

User

Farmer

Crop

Market

MarketPrice

Recommendation

ChatHistory

GovernmentScheme

WeatherSnapshot

TransportRoute

```

Never expose SQLAlchemy models directly.

---

# Schemas

Every endpoint uses

Request Schema

Response Schema

Validation Schema

Never use dictionaries directly.

Always use Pydantic.

---

# Dependency Injection

Use FastAPI dependency injection.

Never instantiate services inside routes.

Good

```

Depends(get_market_service)

```

Avoid

```

MarketService()

```

---

# Async Programming

Use async everywhere possible.

Example

```

async def get_market():

```

Avoid blocking operations.

Never perform synchronous HTTP requests.

---

# Database Rules

Use PostgreSQL.

Always

Indexes

Foreign Keys

Constraints

Transactions

Connection Pooling

Never duplicate data.

Normalize tables.

---

# Configuration

Never hardcode configuration.

Everything comes from

```

.env

```

Example

```

DATABASE_URL

OPENAI_API_KEY

GOOGLE_MAPS_API_KEY

OPENWEATHER_API_KEY

JWT_SECRET

LANGSMITH_API_KEY

REDIS_URL

```

---

# Error Handling

Create a global exception handler.

Support

Validation Errors

Database Errors

Timeouts

Network Failures

Unexpected Exceptions

Every API returns consistent responses.

Example

```

{

"success":false,

"message":"Unable to fetch market prices.",

"error_code":"MARKET_API_TIMEOUT"

}

```

---

# Logging

Every request should log

Timestamp

Route

User

Execution Time

Status Code

Errors

AI Agent Execution

External API Calls

Never print().

Use structured logging.

---

# Authentication

JWT Authentication.

Support

Access Token

Refresh Token

Role Based Access

Roles

Farmer

Admin

Government Officer

Never trust client-side roles.

---

# Middleware

Include

Authentication

CORS

Rate Limiting

Logging

Performance Monitoring

Error Handler

Request ID

---

# AI Layer

All AI logic belongs here.

Never inside API routes.

Structure

```

Planner Agent

↓

Market Agent

↓

Weather Agent

↓

Transport Agent

↓

Profit Agent

↓

Government Agent

↓

Decision Agent

```

Every agent is independent.

Every agent has

Prompt

Tools

Validation

Output Schema

---

# External APIs

Supported APIs

AGMARKNET

Google Maps

Distance Matrix

Geocoding

OpenWeather

Government Schemes

Always implement

Retry

Timeout

Caching

Error Handling

Validation

Never call APIs directly from routes.

---

# Redis

Use Redis for

Caching

Session Data

Rate Limiting

Temporary AI State

Never store permanent data.

---

# Celery

Use background workers for

Daily Market Sync

Weather Updates

Notifications

Scheduled Jobs

Report Generation

Never execute long-running tasks inside API requests.

---

# Performance

Always

Async

Pagination

Caching

Batch Queries

Connection Pooling

Avoid N+1 Queries

Never query the database inside loops.

---

# Security

Always validate input.

Always sanitize text.

Never expose stack traces.

Hash passwords with bcrypt.

Use HTTPS.

Validate JWT.

Protect private endpoints.

Escape SQL input.

---

# API Versioning

Always version APIs.

Example

```

/api/v1/

```

Future

```

/api/v2/

```

Never break existing APIs.

---

# Response Format

Every endpoint returns

```

{

"success":true,

"message":"Success",

"data":{}

}

```

Never return inconsistent JSON.

---

# Testing

Every service should support

Unit Tests

Integration Tests

Repository Tests

API Tests

Mock External APIs

Mock AI Agents

---

# Documentation

Every Service

Purpose

Inputs

Outputs

Dependencies

Exceptions

Example Usage

---

# Code Quality

Follow

PEP8

Type Hints

SOLID

Repository Pattern

Service Layer

Dependency Injection

Clean Architecture

DRY

KISS

Never generate

God Classes

500+ line files

Duplicate Code

Hardcoded Secrets

Business Logic in Routes

Database Calls inside Routes

---

# Production Rules

Every generated backend module must

Be scalable

Be testable

Be secure

Be documented

Be modular

Be asynchronous

Be production-ready

Generate code that a Senior Python Backend Engineer at Stripe or OpenAI would approve.

Never generate tutorial code.

Always think in terms of maintainability, scalability, and long-term production deployment.

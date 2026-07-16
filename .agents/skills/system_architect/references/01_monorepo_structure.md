
# KrishiMitra AI Enterprise Monorepo Structure

## Purpose

This document defines the official project structure for the KrishiMitra AI platform.

Every generated file MUST follow this structure.

Never create files outside this architecture unless explicitly requested.

The project is organized as a monorepo to simplify development, testing, deployment, and future scaling.

---

# Technology Stack

Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- TanStack Query
- React Router
- React Hook Form
- Zod
- Recharts

Backend

- Python 3.12+
- FastAPI
- LangGraph
- LangChain
- SQLAlchemy
- Alembic
- PostgreSQL
- Redis
- Celery

Infrastructure

- Docker
- Docker Compose
- Nginx
- GitHub Actions

AI

- OpenAI / Gemini
- LangGraph
- LangSmith
- Whisper

External APIs

- AGMARKNET
- Google Maps
- Google Geocoding
- Distance Matrix
- OpenWeather API

---

# Enterprise Folder Structure

```
KrishiMitra-AI/

│
├── .agents/
│
├── frontend/
│
├── backend/
│
├── docker/
│
├── docs/
│
├── scripts/
│
├── infrastructure/
│
├── .github/
│
├── .env.example
│
├── docker-compose.yml
│
├── README.md
│
└── LICENSE
```

---

# Frontend Structure

```
frontend/

src/

    app/

        router/

        layouts/

        providers/

        store/

    assets/

        icons/

        images/

        fonts/

        animations/

    components/

        common/

        forms/

        charts/

        maps/

        ui/

        chat/

        navigation/

    features/

        authentication/

        dashboard/

        market/

        weather/

        transport/

        recommendation/

        government/

        profile/

        settings/

    hooks/

    services/

        api/

        websocket/

    lib/

    styles/

    types/

    utils/

    constants/

    pages/

    App.tsx

    main.tsx

public/

package.json

vite.config.ts
```

---

# Backend Structure

```
backend/

app/

    api/

        v1/

            routes/

    agents/

        planner/

        market/

        transport/

        weather/

        profit/

        government/

        recommendation/

    graph/

    services/

    repositories/

    models/

    schemas/

    database/

    middleware/

    security/

    core/

    config/

    prompts/

    utils/

    dependencies/

    websocket/

    workers/

tests/

migrations/

requirements.txt

main.py
```

---

# LangGraph Structure

```
graph/

graph.py

state.py

nodes/

    planner.py

    market.py

    weather.py

    transport.py

    government.py

    profit.py

    recommendation.py

edges/

memory/

tools/

prompts/
```

---

# API Layer

Every API endpoint belongs inside

```
api/v1/routes/
```

Example

```
chat.py

market.py

weather.py

transport.py

government.py

recommendation.py

auth.py

user.py
```

Never place business logic inside routes.

Routes should only

- Validate Request
- Call Service
- Return Response

---

# Service Layer

Contains business logic.

Example

```
MarketService

WeatherService

TransportService

RecommendationService

GovernmentSchemeService
```

Services never communicate directly with the frontend.

---

# Repository Layer

Responsible for database operations.

Repositories never contain business logic.

Repositories only

- Create
- Read
- Update
- Delete
- Search

---

# Database Layer

```
database/

session.py

base.py

seed.py

init_db.py
```

Never connect to PostgreSQL directly from services.

Always use SQLAlchemy Sessions.

---

# Models

Every database table gets one model.

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
```

---

# Schemas

Every API has

Request Schema

Response Schema

Validation Schema

Never expose SQLAlchemy models directly.

---

# Prompts

Store all LLM prompts here.

```
prompts/

planner.md

market.md

weather.md

profit.md

government.md
```

Never hardcode prompts inside Python files.

---

# Utilities

Contains

Formatting

Date Helpers

Validators

Distance Calculators

Currency Helpers

Never place business logic here.

---

# Middleware

Contains

Authentication

Logging

CORS

Rate Limiting

Error Handler

Performance Monitor

---

# Workers

Contains

Background Jobs

Email

Notifications

Scheduled Tasks

Daily Market Sync

Weather Cache Refresh

---

# Tests

```
tests/

unit/

integration/

api/

agents/

frontend/
```

Every feature should have tests.

---

# Documentation

```
docs/

architecture/

api/

database/

deployment/

developer-guide/

agent-design/
```

---

# Docker

```
docker/

frontend/

backend/

postgres/

redis/

nginx/
```

---

# Scripts

Contains automation.

Examples

```
seed_database.py

create_admin.py

sync_market_prices.py

sync_weather.py

backup_database.py
```

---

# Assets

```
assets/

icons/

logos/

illustrations/

animations/

fonts/
```

Never mix assets with components.

---

# Naming Conventions

Folders

lowercase

Example

```
market

weather

transport
```

Files

snake_case for Python

PascalCase for React Components

camelCase for variables

SCREAMING_SNAKE_CASE for constants

---

# Import Rules

Always use absolute imports where possible.

Avoid deep relative imports.

Good

```
from app.services.market import MarketService
```

Avoid

```
../../../market/service
```

---

# Project Principles

Every feature must be

Modular

Reusable

Scalable

Testable

Documented

Secure

Type Safe

Accessible

Responsive

Production Ready

---

# Never Do

Never generate

Huge files (>500 lines)

Business logic inside React components

Database logic inside API routes

Hardcoded secrets

Hardcoded URLs

Inline CSS

Placeholder APIs

Fake responses

Duplicate code

Multiple responsibilities in one class

---

# Always Do

Follow Clean Architecture.

Follow SOLID.

Keep components reusable.

Keep services independent.

Keep agents isolated.

Separate UI from business logic.

Separate business logic from persistence.

Every generated file must fit naturally into this structure.

This document is the official filesystem blueprint for the KrishiMitra AI platform.

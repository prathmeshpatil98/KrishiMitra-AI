
# KrishiMitra AI Environment Variables

## Purpose

This document defines all required environment variables for the KrishiMitra AI platform.

Never hardcode secrets.

Always read configuration from environment variables.

Never commit `.env` files to Git.

Only commit `.env.example`.

---

# General Rules

- Use environment variables for every configurable value.
- Never expose secrets to the frontend.
- Validate required variables during application startup.
- Fail fast if required variables are missing.
- Separate Development, Staging, and Production environments.
- Use Pydantic Settings for configuration management.

---

# Project Structure

backend/

```
app/

    core/

        config.py
```

Frontend

```
frontend/

.env

.env.local

.env.production
```

Backend

```
backend/

.env

.env.example
```

---

# Application

```env
APP_NAME=KrishiMitra AI

APP_VERSION=1.0.0

APP_ENV=development

DEBUG=true

LOG_LEVEL=INFO

TIMEZONE=Asia/Kolkata
```

Allowed APP_ENV

```
development

staging

production
```

---

# FastAPI

```env
API_PREFIX=/api/v1

HOST=0.0.0.0

PORT=8000

WORKERS=4
```

---

# Frontend

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1

VITE_APP_NAME=KrishiMitra AI

VITE_GOOGLE_MAPS_API_KEY=

VITE_ENABLE_ANALYTICS=false
```

Never expose backend secrets using VITE variables.

Only public keys belong here.

---

# Database

```env
DATABASE_HOST=localhost

DATABASE_PORT=5432

DATABASE_NAME=krishimitra

DATABASE_USER=postgres

DATABASE_PASSWORD=password

DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/krishimitra
```

Always use DATABASE_URL in production.

---

# Redis

```env
REDIS_HOST=localhost

REDIS_PORT=6379

REDIS_PASSWORD=

REDIS_URL=redis://localhost:6379
```

---

# JWT

```env
JWT_SECRET_KEY=

JWT_REFRESH_SECRET_KEY=

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

REFRESH_TOKEN_EXPIRE_DAYS=30
```

Secrets must contain at least 64 random characters.

---

# LangGraph

```env
LANGGRAPH_CHECKPOINTER=postgres

LANGGRAPH_THREAD_TIMEOUT=300

LANGGRAPH_MAX_ITERATIONS=15
```

---

# LangSmith

```env
LANGCHAIN_TRACING_V2=true

LANGCHAIN_API_KEY=

LANGCHAIN_PROJECT=KrishiMitra AI

LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

---

# OpenAI

```env
OPENAI_API_KEY=

OPENAI_MODEL=gpt-5

OPENAI_TEMPERATURE=0.2

OPENAI_MAX_TOKENS=4000
```

Never hardcode model names.

Always configure via environment variables.

---

# Google Gemini

```env
GEMINI_API_KEY=

GEMINI_MODEL=gemini-2.5-pro
```

---

# Ollama

```env
OLLAMA_BASE_URL=http://localhost:11434

OLLAMA_MODEL=llama3.1:8b
```

---

# AGMARKNET

```env
AGMARKNET_API_KEY=

AGMARKNET_BASE_URL=
```

If no official API is available, configure your data source URL here.

---

# Google Maps

```env
GOOGLE_MAPS_API_KEY=

GOOGLE_GEOCODING_API_KEY=

GOOGLE_DISTANCE_MATRIX_API_KEY=

GOOGLE_PLACES_API_KEY=
```

---

# Weather

```env
OPENWEATHER_API_KEY=

OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

---

# Government Schemes

```env
GOVERNMENT_API_URL=

GOVERNMENT_API_KEY=
```

---

# Voice AI

```env
WHISPER_MODEL=large-v3

ELEVENLABS_API_KEY=

GOOGLE_TTS_API_KEY=
```

---

# Email

```env
SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_USER=

SMTP_PASSWORD=

SMTP_FROM=
```

---

# File Uploads

```env
MAX_UPLOAD_SIZE_MB=20

UPLOAD_DIRECTORY=uploads
```

Allowed Formats

```
jpg

jpeg

png

pdf

wav

mp3
```

---

# CORS

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

CORS_ALLOW_CREDENTIALS=true
```

Never use

```
*
```

in production.

---

# Logging

```env
LOG_LEVEL=INFO

LOG_FORMAT=json

ENABLE_REQUEST_LOGGING=true
```

---

# Cache

```env
CACHE_TTL_MARKET=300

CACHE_TTL_WEATHER=600

CACHE_TTL_SCHEMES=86400
```

---

# Rate Limiting

```env
RATE_LIMIT_PER_MINUTE=60

AUTH_RATE_LIMIT=10
```

---

# Feature Flags

```env
ENABLE_VOICE=true

ENABLE_STREAMING=true

ENABLE_ANALYTICS=false

ENABLE_DEBUG_PANEL=false
```

---

# Production

```env
ENABLE_HTTPS=true

ENABLE_SWAGGER=false

ENABLE_REDOC=false
```

Swagger should be disabled in production unless explicitly required.

---

# Monitoring

```env
SENTRY_DSN=

ENABLE_METRICS=true
```

---

# Validation Rules

The application must

Validate all required variables during startup.

Display clear startup errors.

Fail immediately if critical variables are missing.

Never silently ignore missing configuration.

---

# Security Rules

Never

Commit .env

Print secrets

Expose backend keys

Store API keys in React

Hardcode passwords

Hardcode URLs

---

# Configuration Rules

All configuration must be loaded through

Pydantic BaseSettings

Never use

os.getenv()

throughout the project.

Configuration should be centralized in

```
backend/app/core/config.py
```

---

# .env.example

Always provide

.env.example

Never provide

.env

inside Git repositories.

---

# Final Rule

Every configurable value in KrishiMitra AI must come from environment variables.

There should be zero hardcoded secrets anywhere in the project.


# KrishiMitra AI Enterprise API Contracts

## Purpose

This document defines the official REST API specification for the KrishiMitra AI platform.

Every FastAPI endpoint MUST follow these contracts.

The API must be:

- RESTful
- Versioned
- Secure
- Consistent
- Typed
- Documented
- Production Ready

Never generate endpoints outside this specification unless requested.

---

# Base URL

/api/v1

Example

/api/v1/chat

/api/v1/markets

/api/v1/weather

---

# Standard Response Format

Every successful response must return

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {},
  "timestamp": "",
  "request_id": ""
}
```

Every failed response must return

```json
{
  "success": false,
  "message": "Unable to process request.",
  "error_code": "MARKET_API_TIMEOUT",
  "details": {},
  "timestamp": "",
  "request_id": ""
}
```

Never return inconsistent JSON.

---

# Authentication

POST

/api/v1/auth/login

Request

```json
{
    "email":"",
    "password":""
}
```

Response

```json
{
   "access_token":"",
   "refresh_token":"",
   "expires_in":3600
}
```

---

POST

/api/v1/auth/refresh

Returns

New Access Token

---

POST

/api/v1/auth/logout

Invalidates JWT.

---

GET

/api/v1/users/me

Returns authenticated user profile.

---

# AI Chat

POST

/api/v1/chat

Purpose

Main AI conversation endpoint.

Request

```json
{
   "message":"I have 500kg onions.",
   "language":"en",
   "location":"Kolhapur"
}
```

Response

```json
{
  "success":true,
  "data":{
      "conversation_id":"",
      "stream_url":"",
      "recommendation":{}
  }
}
```

---

# Streaming

WebSocket

```
/ws/chat/{conversation_id}
```

Events

Planning

Market Search

Weather Search

Distance Calculation

Profit Calculation

Recommendation

Completed

Never block until completion.

Always stream.

---

# Market API

GET

/api/v1/markets

Returns

Nearby Markets

Current Prices

Distance

Travel Time

Price Trend

Request

```
location=Kolhapur

crop=Onion
```

---

GET

/api/v1/markets/history

Returns

Historical Prices

Weekly Trend

Monthly Trend

Prediction

---

GET

/api/v1/markets/{market_id}

Returns

Complete Market Information

---

# Weather API

GET

/api/v1/weather/current

Returns

Current Weather

Temperature

Humidity

Rain

Wind

---

GET

/api/v1/weather/forecast

Returns

7 Day Forecast

Harvest Recommendation

Risk Analysis

---

# Distance API

GET

/api/v1/transport/distance

Request

```
origin=

destination=
```

Returns

Driving Distance

Travel Time

Estimated Fuel Cost

---

GET

/api/v1/transport/routes

Returns

Alternative Routes

Traffic

Road Conditions

---

# Recommendation API

POST

/api/v1/recommendation

Request

```json
{
 "crop":"Tomato",
 "quantity":500,
 "location":"Kolhapur"
}
```

Returns

Best Market

Expected Profit

Weather Risk

Transport Cost

Confidence Score

Reasoning

---

# Government Schemes

GET

/api/v1/government/schemes

Returns

Available Schemes

Eligibility

Benefits

Deadlines

Documents

---

GET

/api/v1/government/schemes/{scheme_id}

Returns

Complete Scheme Details

---

# Voice API

POST

/api/v1/voice/transcribe

Input

Audio File

Returns

Text

Language

Confidence

---

POST

/api/v1/voice/speak

Input

Text

Returns

Audio Stream

---

# Farmer Profile

GET

/api/v1/farmers/{id}

Returns

Farmer Details

Crop History

Recommendations

Chat History

---

PUT

/api/v1/farmers/{id}

Updates Profile

---

# Dashboard

GET

/api/v1/dashboard

Returns

Weather

Market Prices

AI Recommendation

Recent Chats

Alerts

Profit Estimate

Nearby Markets

---

# Notifications

GET

/api/v1/notifications

Returns

Unread Notifications

---

PUT

/api/v1/notifications/read

Marks notifications as read.

---

# Health

GET

/api/v1/health

Returns

API Status

Database Status

Redis Status

LangGraph Status

External APIs

---

# Request Validation

Always validate

Required Fields

Length

Enums

Numbers

Dates

Coordinates

Languages

Never trust client input.

---

# Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable

---

# Pagination

Collections must support

page

limit

sort

order

Example

```
GET /markets?page=1&limit=20
```

---

# Filtering

Support

Search

Crop

Location

Date

Market

Weather

---

# Sorting

Support

Price

Distance

Profit

Date

Alphabetical

---

# API Security

JWT Authentication

HTTPS

Rate Limiting

Input Validation

SQL Injection Protection

Prompt Injection Protection

Request Size Limits

---

# Headers

Support

Authorization

Bearer Token

Request ID

Language

Timezone

Device

---

# Error Codes

MARKET_API_TIMEOUT

WEATHER_API_TIMEOUT

INVALID_TOKEN

INVALID_LOCATION

NO_MARKETS_FOUND

DATABASE_ERROR

LANGGRAPH_ERROR

TRANSPORT_ERROR

SCHEME_NOT_FOUND

---

# Documentation

Every endpoint must include

Purpose

Request

Response

Validation

Error Codes

Examples

---

# OpenAPI

Every endpoint must generate

Swagger

OpenAPI 3.1

Redoc

Examples

Descriptions

Schemas

---

# Production Rules

Every endpoint must

Be async

Use Pydantic

Use Dependency Injection

Return typed responses

Log execution

Handle exceptions

Support future versioning

Support monitoring

Support testing

Never generate inconsistent APIs.

Generate APIs suitable for enterprise production systems.

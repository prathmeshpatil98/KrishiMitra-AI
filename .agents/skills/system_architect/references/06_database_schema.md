
# KrishiMitra AI Enterprise Database Blueprint

## Purpose

This document defines the official PostgreSQL database architecture for the KrishiMitra AI platform.

The database is designed for production-scale deployments and supports:

- Multi-user authentication
- AI conversations
- LangGraph state persistence
- Market price history
- Weather caching
- Government schemes
- Farmer profiles
- Recommendation history
- Analytics
- Audit logs

Every database model MUST follow this specification.

---

# Database

PostgreSQL 16+

ORM

SQLAlchemy 2.x

Migration

Alembic

Primary Keys

UUID

---

# Database Principles

Always

Normalized Tables

Foreign Keys

Indexes

Transactions

Soft Deletes

Audit Columns

Optimistic Updates

Never

Duplicate data

Store JSON unnecessarily

Use integer IDs

---

# Audit Columns

Every table must include

id UUID PRIMARY KEY

created_at TIMESTAMP

updated_at TIMESTAMP

created_by UUID

updated_by UUID

deleted_at TIMESTAMP NULL

is_active BOOLEAN

version INTEGER

---

# Relationships

```

User

↓

Farmer Profile

↓

Farm

↓

Crop

↓

Recommendation

↓

Conversation

↓

Messages

```

---

# users

Stores authentication.

Columns

```
id

email

phone

password_hash

role

preferred_language

last_login

is_verified

is_active

created_at

updated_at
```

Indexes

email

phone

---

# farmer_profiles

Stores farmer details.

Columns

```
id

user_id

full_name

state

district

village

latitude

longitude

farm_size

soil_type

primary_crop

secondary_crop

preferred_market

preferred_language

```

Relationship

User → Farmer Profile

1:1

---

# farms

Stores farm information.

Columns

```
id

farmer_id

farm_name

latitude

longitude

total_area

irrigation_type

ownership_type

```

Relationship

Farmer

↓

Many Farms

---

# crops

Stores crops.

Columns

```
id

farm_id

crop_name

quantity

expected_harvest

quality_grade

estimated_cost

status
```

Relationship

Farm

↓

Many Crops

---

# markets

Master mandi list.

Columns

```
id

market_name

district

state

latitude

longitude

address

market_type

```

Unique

Market Name

State

---

# market_prices

Stores historical prices.

Columns

```
id

market_id

crop_name

price

min_price

max_price

arrival_quantity

unit

price_date

source

```

Indexes

crop_name

price_date

market_id

---

# weather_cache

Caches weather.

Columns

```
id

latitude

longitude

temperature

humidity

wind_speed

rain_probability

forecast_json

expires_at
```

Never permanently store weather.

Use TTL.

---

# transport_routes

Stores distance calculations.

Columns

```
id

origin_lat

origin_lng

destination_lat

destination_lng

distance_km

travel_time

fuel_cost

toll_cost

route_provider

cached_until
```

---

# recommendations

Stores AI recommendations.

Columns

```
id

farmer_id

crop_id

recommended_market

expected_profit

transport_cost

weather_risk

confidence

recommendation_json

generated_at
```

Relationship

Farmer

↓

Many Recommendations

---

# conversations

Stores AI conversations.

Columns

```
id

user_id

title

language

started_at

last_message_at
```

---

# messages

Stores chat messages.

Columns

```
id

conversation_id

role

content

token_usage

agent_name

created_at
```

Role

User

Assistant

System

Agent

---

# langgraph_checkpoints

Stores LangGraph state.

Columns

```
id

thread_id

checkpoint_id

state_json

created_at
```

Never store temporary UI state.

---

# government_schemes

Stores schemes.

Columns

```
id

scheme_name

government

category

eligibility

benefits

documents

deadline

website

is_active
```

---

# notifications

Stores alerts.

Columns

```
id

user_id

title

body

notification_type

is_read

created_at
```

---

# api_logs

Tracks API usage.

Columns

```
id

endpoint

method

status_code

execution_time

user_id

request_id

created_at
```

---

# agent_logs

Tracks AI execution.

Columns

```
id

conversation_id

agent_name

execution_time

input_tokens

output_tokens

status

error_message

tool_calls
```

---

# external_api_cache

Generic API cache.

Columns

```
id

provider

cache_key

response_json

expires_at
```

Providers

AGMARKNET

Google Maps

OpenWeather

Government API

---

# audit_logs

Tracks all changes.

Columns

```
id

entity

entity_id

action

old_value

new_value

performed_by

performed_at
```

---

# Indexes

Always index

Foreign Keys

Email

Phone

Crop Name

Market

Price Date

Conversation ID

Thread ID

Created At

---

# Constraints

Always use

NOT NULL

CHECK

UNIQUE

FOREIGN KEY

Never rely only on frontend validation.

---

# UUID Strategy

Every table uses UUID.

Never expose sequential IDs.

---

# Soft Delete

Never permanently delete production data.

Use

deleted_at

instead.

---

# Transactions

Wrap critical operations.

Example

Recommendation Generation

↓

Conversation Save

↓

Agent Log

↓

Notification

Should commit together.

---

# Database Rules

Never

Store passwords

Store API Keys

Store Prompt Templates

Duplicate Market Data

Duplicate Weather Data

---

# Performance

Use

Indexes

Batch Inserts

Connection Pooling

Pagination

Caching

Avoid

N+1 Queries

Full Table Scans

Repeated Queries

---

# Migrations

Every schema change must use Alembic.

Never manually edit production tables.

---

# Security

Encrypt sensitive values.

Validate input.

Prevent SQL Injection.

Use prepared statements.

Restrict database permissions.

---

# Production Rules

Every table must

Be normalized

Be indexed

Be documented

Support auditing

Support soft deletes

Support future scalability

Never generate database schemas outside this blueprint.

This document is the single source of truth for the KrishiMitra AI database.

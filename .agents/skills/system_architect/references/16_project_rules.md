
# KrishiMitra AI Project Rules

## Purpose

This document defines the mandatory engineering rules for the KrishiMitra AI platform.

Every generated file, feature, API, component, AI agent, and database model MUST follow these rules.

These rules override default AI behavior.

If any generated code violates these rules, regenerate it.

---

# Project Goal

KrishiMitra AI is an intelligent multi-agent decision platform that helps farmers maximize profit using

• Live Market Prices
• Weather Intelligence
• Transport Optimization
• Government Schemes
• AI Decision Making

It is NOT a chatbot.

Every feature must support this goal.

---

# Engineering Philosophy

Build software as if it will serve

100,000+

Farmers

Never build demo code.

Never build tutorial code.

Always build production software.

---

# Architecture

Always follow

Clean Architecture

Feature Based Architecture

Repository Pattern

Service Layer

Dependency Injection

SOLID

Never violate architecture for convenience.

---

# AI Philosophy

The AI must reason.

Never answer immediately.

Every recommendation must be based on

Market

Weather

Distance

Transport

Profit

Government Schemes

Never hallucinate.

Never invent data.

Always explain uncertainty.

---

# Frontend Rules

Always

React

TypeScript

Tailwind

Framer Motion

Reusable Components

Responsive

Accessible

Never

Bootstrap

Material UI

Inline CSS

Large Components

Hardcoded Data

---

# Backend Rules

Always

FastAPI

Async

Repository Pattern

Services

Pydantic

SQLAlchemy

PostgreSQL

Never

Business Logic inside Routes

Database inside Routes

AI inside Routes

---

# LangGraph Rules

Planner always executes first.

Independent agents execute in parallel.

Decision Agent executes last.

Response Formatter converts structured output into natural language.

Never create one giant agent.

---

# API Rules

Every endpoint

Versioned

Validated

Documented

Authenticated if required

Returns standard JSON

Logs execution

Supports retries

---

# Database Rules

UUID

Indexes

Foreign Keys

Soft Deletes

Audit Columns

Transactions

Never duplicate data.

---

# UI Rules

Every page must contain

Loading State

Empty State

Error State

Success State

Responsive Layout

Accessibility

Never leave blank screens.

---

# Animation Rules

Every interaction should provide feedback.

Use subtle motion.

Never over animate.

Motion improves usability.

---

# Security Rules

Never expose secrets.

Never trust client input.

Always validate.

Always sanitize.

Protect every private endpoint.

---

# Performance Rules

Cache expensive requests.

Use async.

Avoid duplicate API calls.

Avoid duplicate rendering.

Optimize before scaling.

---

# Code Quality

Every file must

Be typed

Be documented

Be reusable

Be testable

Be readable

Be modular

Be production ready

---

# Error Handling

Never silently fail.

Every error should

Be logged

Have a user-friendly message

Support recovery

Support retries

---

# Logging

Always log

Errors

Warnings

External APIs

AI Agents

Performance

Never log

Passwords

Tokens

Secrets

API Keys

---

# Prompt Rules

Prompt files belong inside

prompts/

Never inside Python code.

Every prompt must

Have one purpose

Be reusable

Be versioned

---

# Components

One Component

One Responsibility

Never create components larger than 300 lines.

---

# Services

One Service

One Domain

MarketService

WeatherService

TransportService

RecommendationService

Never combine unrelated services.

---

# Naming

Clear

Consistent

Descriptive

Avoid

temp

new

final

latest

misc

helpers

---

# Git

Meaningful commits only.

Examples

feat:

fix:

refactor:

docs:

test:

Never

update

changes

final

---

# AI Generated Code

Every generated file should look like it was written by a Senior Engineer.

Never generate

Placeholder Code

TODO Comments

Fake APIs

Mock Business Logic

Example Data in Production Files

---

# User Experience

The farmer should always understand

What the AI is doing

Why the recommendation was made

How profit was calculated

What risks exist

Never hide important reasoning.

---

# Production Checklist

Every generated feature should satisfy

✓ Clean Architecture

✓ Responsive

✓ Accessible

✓ Error Handling

✓ Logging

✓ Security

✓ Async

✓ Typed

✓ Reusable

✓ Modular

✓ Production Ready

---

# Golden Rule

When multiple implementations are possible,

always choose the solution that is

• Easier to maintain
• Easier to test
• Easier to scale
• Easier to understand
• More secure
• More reusable

Never optimize for short code.

Always optimize for long-term maintainability.

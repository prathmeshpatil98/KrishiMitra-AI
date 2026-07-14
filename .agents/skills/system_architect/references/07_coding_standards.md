
# KrishiMitra AI Enterprise Coding Standards

## Purpose

This document defines the official engineering standards for the KrishiMitra AI platform.

Every generated file, regardless of language or framework, MUST follow these standards.

The goal is to generate software that is:

- Production Ready
- Scalable
- Maintainable
- Secure
- Testable
- Readable

Never generate tutorial-quality code.

---

# Engineering Principles

Every engineer and AI assistant must follow:

- SOLID Principles
- Clean Architecture
- Domain-Driven Design (DDD) where applicable
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Composition over Inheritance
- Separation of Concerns

---

# Project Standards

Every feature must be:

- Modular
- Reusable
- Type Safe
- Documented
- Unit Testable
- Integration Testable
- Observable
- Secure

---

# File Size

Maximum Recommended

Python

300 lines

React Components

250 lines

Hooks

150 lines

Utilities

100 lines

If a file grows larger,

split it.

Never create God Files.

---

# Folder Rules

Every folder has a single responsibility.

Good

services/

repositories/

agents/

schemas/

models/

hooks/

components/

Avoid

misc/

helpers/

temp/

new/

old/

test/

---

# Naming Conventions

Python Files

snake_case.py

React Components

PascalCase.tsx

Hooks

useMarket.ts

Interfaces

MarketResponse

Variables

camelCase

Constants

UPPER_SNAKE_CASE

Enums

PascalCase

Database Tables

snake_case

API Endpoints

kebab-case

---

# Python Standards

Always use

Python 3.12+

Type Hints

Pydantic

Dataclasses where appropriate

Never

Use global variables

Ignore exceptions

Use wildcard imports

Use print()

Example

Good

logger.info()

Bad

print()

---

# FastAPI Standards

Routes

Only validate requests

Call services

Return responses

Nothing else.

Never

Query database in routes.

Call external APIs in routes.

Perform AI reasoning in routes.

---

# Service Layer

Services contain

Business Logic

AI Orchestration

Validation

External API calls

Never return SQLAlchemy models.

Return DTOs or Schemas.

---

# Repository Layer

Repositories only

Create

Read

Update

Delete

Search

Never perform calculations.

Never call APIs.

Never call AI.

---

# SQLAlchemy Standards

Always use

Relationships

Indexes

Transactions

Connection Pooling

Lazy Loading

Never

Write raw SQL unless necessary.

Never duplicate queries.

---

# API Standards

Every endpoint

Async

Validated

Documented

Versioned

Typed

Logged

Authenticated if needed

Never return inconsistent responses.

---

# React Standards

Always use

Functional Components

TypeScript

Hooks

Composition

Memoization when appropriate

Never

Class Components

Inline styles

Large Components

Business logic inside JSX

---

# Component Standards

Every component has

One responsibility

Reusable API

Typed Props

Loading State

Empty State

Error State

Accessibility

Never duplicate components.

---

# Hook Standards

Hooks contain

Business Logic

API Integration

State Management

Transformations

Hooks never render UI.

---

# State Management

Server State

TanStack Query

Client State

React Context

Local State

useState

Never store server state inside Context.

---

# Tailwind Standards

Only TailwindCSS.

Never

Bootstrap

Material UI

Inline CSS

Custom CSS unless necessary

Use utility classes.

---

# Animation Standards

Use

Framer Motion

Motion Components

Animate Presence

Never

CSS animation libraries

Flashy effects

Animations must improve UX.

---

# LangGraph Standards

One Agent

One Responsibility

Planner controls execution.

Decision Agent combines outputs.

Agents communicate only via Graph State.

Never call one agent directly from another.

---

# Prompt Standards

Prompts must be

Versioned

Stored separately

Reusable

Testable

Never hardcode prompts in Python files.

---

# Error Handling

Always handle

Validation Errors

Database Errors

Network Errors

Timeouts

AI Errors

Unknown Errors

Never expose stack traces.

---

# Logging Standards

Use

Structured Logging

Log

Execution Time

User ID

Route

Request ID

Errors

External APIs

AI Tool Calls

Never log secrets.

---

# Security Standards

Never

Hardcode API Keys

Expose Secrets

Trust Client Input

Store Plain Passwords

Always

Validate Input

Escape SQL

Hash Passwords

Use JWT

Use HTTPS

Rate Limit APIs

---

# Performance Standards

Always

Cache expensive APIs

Use async

Lazy load components

Paginate data

Reuse connections

Avoid

N+1 Queries

Repeated API Calls

Repeated Rendering

Blocking Operations

---

# Documentation Standards

Every module should include

Purpose

Responsibilities

Dependencies

Usage Example

Public functions should include docstrings.

---

# Git Standards

Branch Names

feature/market-agent

feature/weather

bugfix/login

hotfix/api

Commit Messages

feat: add market recommendation engine

fix: resolve transport API timeout

refactor: split recommendation service

docs: update API documentation

test: add market service tests

Never use

final

latest

new

temp

---

# Testing Standards

Every feature should have

Unit Tests

Integration Tests

API Tests

Mock External APIs

Mock AI Models

Minimum Coverage

80%

---

# Accessibility Standards

Keyboard Navigation

ARIA Labels

Screen Reader Support

High Contrast

Visible Focus States

Semantic HTML

---

# Code Review Checklist

Before accepting generated code verify

✓ Single Responsibility

✓ Proper Naming

✓ Typed

✓ Documented

✓ Error Handling

✓ Logging

✓ Secure

✓ Reusable

✓ Responsive

✓ Accessible

✓ Production Ready

---

# AI Generation Rules

When generating code always

Think before coding.

Prefer architecture over shortcuts.

Prefer maintainability over speed.

Generate reusable modules.

Generate testable code.

Generate scalable systems.

Never generate demo code.

Never generate placeholder logic.

Never sacrifice quality for brevity.

---

# Production Mindset

Generate code as if it will serve

100,000+ users

Millions of API requests

Thousands of concurrent AI conversations

Long-term maintenance by multiple engineering teams

Every generated file should be deployable without architectural changes.

---

# Golden Rule

Every line of code should make the project easier to maintain one year from now.

If there are multiple valid solutions,

always choose the one that is:

- More maintainable
- More scalable
- More secure
- Better tested
- Easier to understand

Think like a Principal Software Engineer at Google, Stripe, or OpenAI—not like a tutorial author.

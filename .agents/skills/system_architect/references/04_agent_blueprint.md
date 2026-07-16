
# KrishiMitra AI Enterprise LangGraph Agent Blueprint

## Purpose

This document defines the official Agentic AI architecture for KrishiMitra AI.

KrishiMitra AI is NOT a chatbot.

It is a multi-agent AI system built using LangGraph that collaborates with specialized agents to maximize a farmer's profit.

Every AI feature must follow this architecture.

---

# Core Philosophy

Never answer directly.

Always reason before responding.

Every response must be generated after collaborating with specialized AI agents.

The objective is not answering questions.

The objective is making the best decision for the farmer.

---

# Technology

Framework

- LangGraph

LLM

- OpenAI GPT
- Gemini

Framework

- LangChain

Memory

- LangGraph Memory
- PostgreSQL Checkpointer

Streaming

- LangGraph Streaming

Tracing

- LangSmith

---

# Agent Architecture

```

User

↓

Planner Agent

↓

Parallel Execution

↓

Market Agent

Weather Agent

Transport Agent

Government Agent

Historical Price Agent

↓

Profit Agent

↓

Decision Agent

↓

Response Formatter

↓

Streaming Response

```

---

# Agent Responsibilities

## Planner Agent

Responsibilities

Understand the user's intent.

Extract

Crop

Quantity

Location

Language

Date

Missing information

Decide which agents should execute.

Planner never answers users directly.

Planner only creates execution plans.

---

## Market Agent

Responsibilities

Retrieve

Today's market prices

Nearby mandis

Historical prices

Price trends

Price volatility

Supported APIs

AGMARKNET

Government APIs

Fallback Database

Output

```

Market Name

Distance

Current Price

Previous Price

Trend

```

---

## Weather Agent

Responsibilities

Retrieve

Current weather

Rain probability

Temperature

Humidity

Wind

Forecast

Determine

Harvest Risk

Storage Risk

Transportation Risk

Supported API

OpenWeather

Output

```

Weather

Risk Level

Recommendation

```

---

## Transport Agent

Responsibilities

Determine

Nearest markets

Driving distance

Travel time

Estimated transport cost

Best route

Supported APIs

Google Maps

Distance Matrix

Geocoding

Output

```

Market

Distance

Travel Time

Estimated Cost

```

---

## Historical Price Agent

Responsibilities

Analyze

Weekly trends

Monthly trends

Seasonal prices

Demand

Supply

Predict

Expected selling price

Best selling day

Future trend

Never hallucinate predictions.

Always explain confidence.

---

## Government Scheme Agent

Responsibilities

Recommend

PM-KISAN

Crop Insurance

Equipment Subsidies

Loans

State Schemes

Determine

Eligibility

Documents Required

Deadlines

Never recommend unavailable schemes.

---

## Profit Agent

Responsibilities

Calculate

Revenue

Transport

Commission

Loading Cost

Net Profit

Formula

Revenue

Transport

Commission

Other Charges

=

Expected Profit

Compare every market.

Return ranking.

---

## Decision Agent

This is the most important agent.

Responsibilities

Receive outputs from

Market Agent

Weather Agent

Transport Agent

Profit Agent

Government Agent

Historical Agent

Determine

Best Market

Best Time

Best Transportation Option

Risk

Confidence Score

Reasoning

Decision Agent always explains WHY.

Never return only numbers.

---

## Response Formatter

Convert structured outputs into

Simple English

Hindi

Marathi

Use bullet points.

Avoid technical terminology.

Farmer should understand instantly.

---

# LangGraph State

Global State

```

Farmer Location

Crop

Quantity

Language

Conversation History

Market Prices

Weather

Distance

Profit

Government Schemes

Agent Outputs

Decision

```

Never store duplicated state.

---

# Execution Rules

Planner always executes first.

Agents execute independently.

Independent agents execute in parallel.

Decision Agent waits for all required outputs.

Streaming begins immediately.

Never block UI.

---

# Tool Calling

Every external integration must be a Tool.

Never call APIs directly from prompts.

Examples

```

get_market_prices()

get_weather()

calculate_distance()

calculate_transport_cost()

get_government_schemes()

predict_price()

```

Each tool

Input Schema

Output Schema

Timeout

Retry

Validation

Logging

---

# Memory

Use memory for

Previous Crops

Farmer Preferences

Language

Conversation

Recent Recommendations

Never memorize temporary API data.

---

# Human in the Loop

If confidence is low

Ask for clarification.

Example

"I found two nearby markets.

Which one are you planning to visit?"

Never guess missing critical information.

---

# Confidence Score

Every recommendation must include

Confidence

Example

95%

Explain confidence.

Example

"Confidence is high because today's market prices and weather data are current."

---

# Failure Recovery

If Market API fails

Use cached data.

If Weather API fails

Continue with warning.

If Maps fail

Use approximate coordinates.

Never completely fail.

Always recover gracefully.

---

# Streaming

Never wait until all processing finishes.

Show progress.

Example

✓ Understanding your request...

✓ Checking market prices...

✓ Finding nearby markets...

✓ Checking weather...

✓ Calculating transportation...

✓ Comparing profits...

✓ Preparing recommendation...

Streaming greatly improves UX.

---

# Prompt Rules

Every agent has

System Prompt

Developer Prompt

Tool Definitions

Output Schema

Validation Rules

Never place prompts inside Python code.

Store prompts separately.

---

# Output Schema

Every agent returns structured JSON.

Example

```

{

"success": true,

"confidence": 94,

"data": {}

}

```

Never return plain text between agents.

---

# Observability

Every agent execution logs

Execution Time

Input

Output

Errors

Retries

Tool Calls

Token Usage

Use LangSmith tracing.

---

# Performance

Execute independent agents in parallel.

Cache expensive API calls.

Avoid duplicate tool execution.

Reuse shared state.

Never call the same API twice.

---

# Security

Validate every tool input.

Sanitize user input.

Prevent prompt injection.

Never expose API keys.

Never expose system prompts.

Never expose internal reasoning.

---

# Agent Communication

Agents communicate only through LangGraph State.

Never directly call another agent.

Planner controls execution.

Decision Agent combines outputs.

---

# Production Rules

Every agent must

Have one responsibility

Be independently testable

Be reusable

Be observable

Be fault tolerant

Support retries

Support structured output

Support streaming

Support future expansion

---

# Never Do

Never create one giant chatbot.

Never place reasoning inside UI.

Never mix business logic with prompts.

Never hardcode API responses.

Never bypass LangGraph.

Never let agents directly modify databases.

---

# Always Do

Think like an AI Systems Engineer.

Every AI response must result from collaboration between specialized agents.

Generate scalable, observable, maintainable LangGraph workflows suitable for production deployment.

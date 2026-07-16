
# KrishiMitra AI Enterprise Frontend Blueprint

## Purpose

This document defines the official frontend architecture for KrishiMitra AI.

Every React component, page, hook, animation, service, and layout MUST follow these standards.

The objective is to build software that looks and feels comparable to products built by:

- OpenAI
- Stripe
- Linear
- Vercel
- Notion
- Perplexity AI

This is NOT a college project.

This is production software.

---

# Technology Stack

Framework

- React 19
- TypeScript
- Vite

Styling

- TailwindCSS

Animation

- Framer Motion

State Management

- TanStack Query
- React Context

Routing

- React Router

Forms

- React Hook Form
- Zod

Icons

- Lucide React

Charts

- Recharts

Maps

- React Leaflet
  or
- Google Maps React

---

# Frontend Principles

Every screen should be

Clean

Minimal

Modern

Responsive

Professional

Accessible

Fast

Elegant

Readable

Never clutter the UI.

Whitespace is part of the design.

---

# Folder Structure

```
frontend/

src/

app/

assets/

components/

features/

hooks/

services/

types/

utils/

styles/

constants/

pages/

layouts/

providers/
```

---

# Component Architecture

Always use reusable components.

Example

```
components/

Button/

Card/

Input/

Modal/

Sidebar/

Navbar/

ChatBubble/

AIThinking/

PriceCard/

WeatherCard/

Map/

Chart/
```

Never duplicate UI.

If multiple pages use the same component,

move it into components/.

---

# Feature Structure

Every feature owns its code.

Example

```
features/

market/

components/

hooks/

services/

types/

pages/

utils/
```

Each feature must remain isolated.

---

# Pages

Every page represents one business feature.

Example

```
Dashboard

Market

Weather

Recommendation

Government Schemes

Settings

Authentication
```

Never place business logic directly inside pages.

Pages compose components.

---

# Layout Rules

Always separate layouts.

Example

```
MainLayout

DashboardLayout

AuthenticationLayout
```

Layouts manage

Sidebar

Navbar

Footer

Page Containers

Breadcrumbs

---

# State Management

Server State

TanStack Query

Client State

React Context

Never use Context for API caching.

Never manually cache API responses.

---

# API Layer

Never call fetch()

inside components.

Always create services.

Example

```
services/api/

market.ts

weather.ts

transport.ts

chat.ts
```

Components only consume hooks.

Hooks call services.

Services call APIs.

---

# Custom Hooks

Business logic belongs in hooks.

Example

```
useMarkets()

useWeather()

useRecommendation()

useTransport()

useVoice()

useChat()
```

Never place API logic inside components.

---

# Type Safety

Every response should have interfaces.

Example

```
Market

Weather

Recommendation

Farmer

Crop

ChatMessage
```

Never use

```
any
```

Strict TypeScript only.

---

# Styling Rules

Only use TailwindCSS.

Never use inline CSS.

Never use CSS frameworks.

Never use Bootstrap.

Never use Material UI.

Use utility-first styling.

---

# Design System

Spacing

8px Grid

Border Radius

rounded-xl

Shadows

Soft

Professional

Typography

Large Headings

Readable Body

Consistent Font Scale

Buttons

Large Click Areas

Hover Feedback

Loading States

Every button supports loading.

---

# Color Palette

Primary

#2E7D32

Secondary

#81C784

Accent

#F9A825

Danger

#DC2626

Success

#16A34A

Background

#F5F7F3

Surface

#FFFFFF

Text Primary

#111827

Text Secondary

#6B7280

Border

#E5E7EB

Never invent new colors.

---

# Animation Standards

Always use Framer Motion.

Every page transition should animate.

Cards should fade.

Buttons should scale slightly.

Lists should stagger.

Charts should animate.

Maps should animate.

Dialogs should fade.

AI responses should stream.

Never over-animate.

Animation must improve usability.

---

# AI Experience

The AI must feel alive.

Example

✓ Finding Market Prices

✓ Checking Weather

✓ Calculating Distance

✓ Comparing Profit

✓ Preparing Recommendation

Display progress live.

Never freeze the interface.

---

# Chat Interface

The chat experience is premium.

Supports

Markdown

Tables

Charts

Images

Streaming

Voice

Typing Indicator

Execution Timeline

Reasoning Progress

Never build a basic chatbot.

---

# Dashboard Rules

Dashboard is NOT an admin panel.

Dashboard is an intelligent assistant.

Widgets

Today's Recommendation

Nearby Markets

Expected Profit

Weather

Crop Status

Price Trend

Transport Estimate

Recent Conversations

Alerts

Every widget should be reusable.

---

# Responsive Design

Support

Desktop

Laptop

Tablet

Mobile

No horizontal scrolling.

Cards should stack naturally.

---

# Accessibility

Every input needs labels.

Keyboard navigation required.

Visible focus states.

High contrast.

Screen reader friendly.

Accessible forms.

---

# Loading States

Never show blank screens.

Always use

Skeletons

Spinners

Progress Bars

Placeholder Cards

Streaming

---

# Empty States

Every page should support

No Data

No Internet

No Search Results

No Recommendations

Show meaningful illustrations.

Never leave empty white screens.

---

# Error Handling

Every API call should support

Retry

Timeout

Offline

Validation Errors

Server Errors

Friendly Messages

---

# Performance

Lazy load pages.

Lazy load charts.

Memoize expensive components.

Use React Query caching.

Avoid unnecessary renders.

Never over-fetch APIs.

---

# Code Rules

Every component

One responsibility.

Small.

Reusable.

Documented.

Typed.

Testable.

Readable.

---

# Naming Conventions

Components

PascalCase

```
MarketCard.tsx
```

Hooks

camelCase

```
useWeather.ts
```

Utilities

camelCase

```
formatCurrency.ts
```

Types

PascalCase

```
Market.ts
```

---

# Never Do

Never use

Bootstrap

Material UI

Inline CSS

Hardcoded Data

Hardcoded Colors

Duplicate Components

Business Logic in Components

Huge Components (>300 lines)

---

# Always Do

Build reusable UI.

Use composition.

Separate concerns.

Think like a Senior Frontend Engineer.

Every generated screen should be deployable.

Every generated component should be reusable.

Every animation should feel premium.

Every page should look like a funded startup product.

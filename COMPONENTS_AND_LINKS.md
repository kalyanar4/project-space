# Components, Links, and Commercial Purpose

## Core navigation
- `app/layout.tsx`
  - Handles global header/footer and primary nav links: `/`, `/technology`, `/projects`, `/blog`, `/tools`, plus footer links.
  - Commercial purpose: top-level discovery and trust framing.

- `app/tools/ToolsNav.tsx`
  - Category navigation for tools hub and tool subpages.
  - Links: `/tools`, `/tools/pdf`, `/tools/ai`, `/tools/developer`, `/tools/ui`, `/tools/data`, `/tools/daily`, `/tools/backend`, `/tools/lambda`.
  - Commercial purpose: guide users into high-intent utility categories and planned waitlist funnels.

## Marketing/content pages
- `app/page.tsx` (Home)
  - Defines niche, service pillars, and component-level commercial mapping.
  - Commercial purpose: conversion from visitor to tool explorer/contact lead.

- `app/projects/page.tsx`
  - Project credibility layer.
  - Commercial purpose: authority and enterprise trust.

- `app/technology/page.tsx`
  - Tech stack transparency.
  - Commercial purpose: confidence for technical buyers and collaborators.

- `app/blog/page.tsx` + `app/blog/[slug]/page.tsx`
  - Blog listing and detail pages.
  - Commercial purpose: SEO discovery and educational trust.

## Tool pages
- `app/tools/page.tsx`
  - Catalog of live/planned categories with status and business rationale.
  - Includes funnel analytics (`tools_page_view`, `tools_category_click`).
  - Commercial purpose: route users to action and upsell paths.

- `app/tools/ai/page.tsx`
  - AI tool directory.
  - Commercial purpose: AI workflow adoption and repeat usage.

- `app/tools/ai/text-generator/page.tsx`
  - Prompt-based generation UI, backed by `/api/generate-text`.
  - Uses loading/empty/error state components.
  - Commercial purpose: core activation flow for AI category.

- `app/tools/ai/news/page.tsx`
  - Curated AI news feed.
  - Includes empty-state handling.
  - Commercial purpose: recurring engagement loop.

- `app/tools/ai/chatbot/page.tsx`, `app/tools/ai/image-enhancer/page.tsx`
  - Planned feature pages with clear positioning.
  - Commercial purpose: roadmap signaling and early-access lead capture.

- `app/tools/pdf/page.tsx`
  - PDF tool directory with live/planned status.
  - Commercial purpose: high-intent utility acquisition.

- `app/tools/pdf/merge/page.tsx`
  - Merge workflow with drag-reorder and download.
  - Uses loading/empty/error state components.
  - Commercial purpose: daily utility retention.

- `app/tools/pdf/split/page.tsx`
  - Split pages by ranges and download outputs.
  - Uses loading/empty/error state components.
  - Commercial purpose: repeat operational use.

- `app/tools/pdf/pdf-to-word/page.tsx`
  - Convert PDF text into DOCX output.
  - Uses loading/empty/error state components.
  - Commercial purpose: practical conversion workflow and stickiness.

- `app/tools/pdf/compress/page.tsx`
  - Planned compression page (safe placeholder until robust implementation).
  - Commercial purpose: preserve trust while building future premium utility.

- `app/tools/developer/page.tsx`
  - Live MVP toolset: JSON formatter, Base64 encode/decode, URL encode/decode.
  - Commercial purpose: immediate utility value and repeat developer usage.

- `app/tools/[category]/page.tsx`
  - Dynamic planned-category pages (`ui`, `data`, `daily`, `backend`, `lambda`).
  - Includes analytics event `planned_join_early_access_click`.
  - Commercial purpose: eliminate dead links and capture interest before launch.

## APIs and shared components
- `app/api/generate-text/route.ts`
  - Validates prompt input and calls OpenAI Chat Completions.
  - Commercial purpose: reliable AI output endpoint for product flows.

- `components/PageAnalytics.tsx`
  - Page-level analytics event dispatch.
  - Commercial purpose: measure funnel health and behavior.

- `components/TrackedLink.tsx`
  - Link wrapper with click event tracking.
  - Commercial purpose: attribute conversion paths.

- `components/FlowStates.tsx`
  - Reusable loading/empty/error states for tool experiences.
  - Commercial purpose: reduce drop-off via clear feedback states.

- `components/ThemeToggle.tsx`
  - Light/dark toggle with persisted preference.
  - Commercial purpose: improve usability and session comfort.

- `components/NewsCard.tsx`
  - Reusable media card for external news links.
  - Commercial purpose: content consumption and recurring visits.

- `lib/basePath.ts`
  - Base-path-safe asset URL generation.
  - Commercial purpose: deployment reliability (especially subpath hosting).

- `tests/e2e/smoke.test.ts`
  - Smoke tests for route integrity and core funnel instrumentation.
  - Commercial purpose: prevent broken journeys in production.

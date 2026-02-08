# Week 5 Operations Runbook

## Objective
Operate the product with a weekly KPI loop that improves activation, retention, conversion, lead capture, and revenue efficiency.

## Dashboard
- Route: `/growth/kpis`
- Data source: browser analytics event log via `lib/analytics.ts`
- Core events used:
  - `landing_view`
  - `tool_start`
  - `tool_success`
  - `email_capture`
  - `upgrade_click`
  - `checkout_complete`

## Weekly Review Cadence
1. Open `/growth/kpis` and capture metric snapshot.
2. Compare week-over-week changes for each KPI.
3. Identify one bottleneck KPI and one supporting KPI.
4. Ship one focused change tied to that bottleneck.
5. Validate impact in next weekly snapshot.

## Decision Rules
- Keep changes that improve activation, retention, or conversion without hurting reliability.
- Remove features that add UI noise but do not move KPI outcomes.
- Prioritize hero tool flow improvements before adding net-new categories.

## Suggested Week 5 Experiments
- Activation:
  - simplify first input prompts on hero tools
  - add one-click sample data templates
- Retention:
  - add return reminders in post-success email sequence
  - add "continue last workflow" shortcut cards
- Conversion:
  - test upgrade prompt copy at value moments
  - test annual/agency pricing anchor on `/checkout/pro`

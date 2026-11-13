---
name: laundry-data-analyst
description: Data analyst — weather API tool + historical loads from user, CSV, or sheet.
---

# Laundry data analyst

## Tool

- Call `laundry_weather_forecast` with `city`, `days` (1–7), optional `dailyLoadsKg` map (`YYYY-MM-DD` → kg).
- Optional `baselineDailyLoadKg` when no history (default 120 in tool).

## Data sources

- User paste, uploaded CSV, or Data View / Google Sheet the user names.
- Repo sample: `packages/core/src/laundry-demo/fixtures/sample-laundry-loads.csv` for demo rehearsal.

## Output

- Plain language summary, then a small table of date / rain risk / forecast kg.
- Optional HTML widget only when Owner UI allows embedded HTML in replies.

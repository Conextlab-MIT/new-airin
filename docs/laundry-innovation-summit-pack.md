# Laundry Innovation Summit pack (P0-1 … P0-7)

Pre-loaded **six agents** plus org tools for the summit demo. Catalog lives in `packages/core/src/agent-marketplace/catalog-laundry.ts`. Extension point: `packages/core/src/agent-marketplace/catalog.ts` (core + laundry lookup).

## Install (< 15 minutes, fresh DB)

1. Start server + web (`bun run dev:server`, `bun run dev:web`).
2. Create or open org **Laundry Demo**; set demo user language **EN** if needed (P0-0).
3. As **org admin**, run:

```bash
curl -sS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE_URL/v1/agent-marketplace/packs/laundry-innovation-summit/install"
```

4. Enable official **Data View** plugin for finance (P0-5); sync synthetic P&L sheet.
5. Set tool credentials (no secrets in git):
   - `OPENWEATHER_API_KEY` — analyst weather tool
   - `APIFY_API_KEY` — visibility Maps scrape (optional `APIFY_MAPS_ACTOR_ID`, default `compass/crawler-google-places`)
   - `OPENROUTER_API_KEY` — Sari social images via tool `laundry_openrouter_image` (default model `google/gemini-2.5-flash-image`)
6. Composio: connect **instagram** (Social), **googlesheets** (Dimas) when posting/sheet reads are in the script.
7. WhatsApp (P0-3): pair number + worker before stage; failover = web-only Support agent.

## Profiles created

| Sidebar name | Profile id | Catalog id |
|---|---|---|
| Sari | `laundry_social` | `laundry-social` |
| Rina | `laundry_support` | `laundry-support` |
| Ardi | `laundry_analyst` | `laundry-analyst` |
| Dimas | `laundry_finance` | `laundry-finance` |
| Gilang | `laundry_visibility` | `laundry-visibility` |
| Toni | `laundry_ops` | `laundry-ops` |

Each profile gets SOUL / STYLE / INSTRUCTIONS / MEMORY plus a **role one-liner** in INSTRUCTIONS.

## Bundled skills (pack-only)

Under `packages/core/src/skills/bundled/laundry-*` — assigned on pack install, not default Airin skills.

## Demo tools (org `tools/`)

| Tool | Template |
|---|---|
| `laundry_weather_forecast` | `packages/core/src/laundry-demo/tool-templates/laundry-weather-forecast.js` |
| `laundry_apify_maps_reviews` | `packages/core/src/laundry-demo/tool-templates/laundry-apify-maps-reviews.js` |
| `laundry_openrouter_image` | `packages/core/src/laundry-demo/tool-templates/laundry-openrouter-image.js` |

Sample loads CSV: `packages/core/src/laundry-demo/fixtures/sample-laundry-loads.csv`.

## Re-import

Pack install is **idempotent** for tools (skips existing names). Agents skip with 409 if the same display name already exists. For a clean re-import, use a fresh org or remove the six profiles first.

## Not in pack ZIP

API keys, Composio OAuth, WhatsApp pairing, and live sheet URLs — configure per environment only.

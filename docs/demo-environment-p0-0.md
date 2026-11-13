# P0-0 — Demo environment status (Laundry Innovation Summit)

_Last verified: local dev, Airin **0.4.74**._

## Services

| Check | URL / command | Status |
|---|---|---|
| API | `http://127.0.0.1:4310/health` | **OK** — `ok: true`, `providerConfigured: true`, `userConfigured: true`, `onboardingEnabled: false` |
| Web (record-demo target) | `http://localhost:3003/` | **OK** — HTTP 200 (Vite dev) |
| Web (proxy/alternate) | `http://localhost:4310/` | **OK** — HTTP 200 (static + API) |
| Landing waitlist API | `POST /v1/public/waitlist/laundry-innovation-summit` | **OK** after route registration (public + `registerDemoWaitlistRoutes` before auth) |
| Landing page | `http://localhost:3003/laundry-innovation-summit` | **OK** — public route (no login) |

## Demo org & agents (Conextlab)

| Role (summit) | Profile | ID | Deep link (`?new=1`) |
|---|---|---|---|
| Media sosial | **Kezia** | `gtTtoXn1iCQ4vs23QA5t1` | `/chat/gtTtoXn1iCQ4vs23QA5t1?new=1` |
| Layanan WhatsApp | **Hana** | `nGUJaUQuNsYFEs7OKA5hH` | `/chat/nGUJaUQuNsYFEs7OKA5hH?new=1` |
| Analis data | **Bima** | `USutb4x8J0cfftGCfcamo` | `/chat/USutb4x8J0cfftGCfcamo?new=1` |
| Keuangan (Sheets) | **Dimas** | `3Ssx1u7mldEUAYUMYWe99` | `/chat/3Ssx1u7mldEUAYUMYWe99?new=1` |
| Visibilitas / Maps | **Fajar** | `0AyBNucJ6YHYOTLE0uBSI` | `/chat/0AyBNucJ6YHYOTLE0uBSI?new=1` |
| Ops (opsional) | **Bima** or backup **Jovan** | `kAFhYDuLcFeuNjJzdQ4Pv` | Koordinator tim |

**Org:** `Conextlab` (`org_fb5924491e554dbcbc6bf861a6ac3c00`)

**Gap vs P0-1 “laundry pack”:** Personas exist but are **generic SME** instructions; not yet laundry-tuned souls, weather tool, Apify tool, or Sheet IDs wired per profile. Treat as **staging workspace** until pack import lands.

## Integrations

| Integration | Status | Notes |
|---|---|---|
| Composio | `composioConfigured: true`, `composioAvailable: **false**` on `/health` | Org has 2 toolkits in DB; live tool surfacing may still be limited — test in **Connections** before stage |
| MCP (Exa, Firecrawl) | Enabled in DB | Useful fallback if Apify late |
| Apify | **Not wired in repo** | P0-6 pending; demo script uses `web_search` / rehearsed fixture until tool exists |
| WhatsApp worker | **Not observed running** | Run `bun run dev:whatsapp` + pairing; else demo **web-only** for Hana |
| Data View plugin | Check **Plugins** in org | Required for Dimas Sheet narrative |
| Onboarding | **Off** (`onboardingEnabled: false`) | Matches “skip onboarding” summit flow |

## Presenter login (local)

Use your configured admin (e.g. `admin@conextlab.ai`). **Owner mode** default (`airin-ui-mode` in localStorage). Pin six agents in sidebar before show.

## record-demo skill

- App URL: `http://localhost:3003`
- If 502: `AIRIN_PORT=4310 bun run dev:server` + `bun run dev:web`
- See [`.agents/skills/record-demo/SKILL.md`](../.agents/skills/record-demo/SKILL.md)

## Pre-flight (5 min)

1. `curl -s http://127.0.0.1:4310/health | jq .ok,.providerConfigured,.onboardingEnabled`
2. Open `http://localhost:3003/chat` — Owner sidebar shows Kezia, Hana, Bima, Dimas, Fajar
3. `POST` waitlist test (no auth) — expect `{"ok":true}`
4. Optional: WhatsApp test message to paired number
5. Language: **Settings → Indonesian** (or profile replies already default ID)

## Still open for summit hardening

- Dedicated laundry SOUL copy per agent (P0-1)
- Weather custom tool on Bima (P0-4)
- Apify tool on Fajar (P0-6)
- Composio Google Sheets write for Hana “log to Sheet” beat
- WhatsApp worker + stage phone

# Sprint backlog — P0

Parent: [sprint-backlog.md](./sprint-backlog.md)

## P0 — Tomorrow: Laundry Innovation Summit demo

### P0-0 — Demo environment & runbook (gate for all P0)

| Field | Value |
|---|---|
| **Owner** | Human: **Demo lead / platform admin** |
| **Subagent** | `ci-investigator` (health checks), `Orca` ops runbooks if used |
| **Estimate** | **0.5 PD** |
| **Dependencies** | Provider API key configured; Docker or `bun run dev:server` + `dev:web`; WhatsApp worker optional but rehearsed |
| **Acceptance criteria** | (1) One org **Laundry Demo** exists with English reply default or install language **EN** for demo user. (2) `GET /health` → `ok`, `providerConfigured: true`. (3) Owner mode is default for demo account. (4) Written **failover**: if WhatsApp bridge down, support story uses web-only agent. (5) No live dependency on unrehearsed Super-Nakama tool authoring during the talk. |

---

### P0-1 — Laundry workspace pack (org bootstrap + six agents)

| Field | Value |
|---|---|
| **Owner** | Human: **Product + platform admin** |
| **Subagent** | `Serena Blackwood` (pack structure), `Marcus Webb` (import script / packs) |
| **Estimate** | **1.5 PD** |
| **Dependencies** | P0-0; profile pack import path ([`profile-portability`](./current-state-brd-prd.md) §5.3); stable enough tree to run server |
| **Acceptance criteria** | (1) Import or restore creates org with **six pinned profiles** in Owner sidebar: Social, Support (WhatsApp), Analyst, Finance (Dimas), Visibility, Operations. (2) Each has SOUL/STYLE/INSTRUCTIONS + role one-liner visible in chat. (3) Demo user sees all six without visiting Profiles admin. (4) Pack is **re-importable** on a fresh DB in &lt;15 minutes (documented steps). (5) No secrets in pack ZIP (API keys via env / Composio / tool credentials only). |

---

### P0-2 — Agent: Social media

| Field | Value |
|---|---|
| **Owner** | Human: **Content / GTM** |
| **Subagent** | `Priya Desai` (copy + prompts), `skill-reviewer` (SKILL.md) |
| **Estimate** | **0.5 PD** |
| **Dependencies** | P0-1; Composio toolkits connected where used; **no** first-class posting API (honest limits) |
| **Acceptance criteria** | (1) Agent produces **draft posts + calendar ideas** and copy-paste-ready captions for laundry context. (2) Skill instructs: use Composio only when user's account connected; otherwise draft-only. (3) **No claim** of auto-posting or carousel builder unless wired in P1. (4) One rehearsed prompt returns a coherent multi-channel plan in &lt;2 turns. |

---

### P0-3 — Agent: Customer support (WhatsApp)

| Field | Value |
|---|---|
| **Owner** | Human: **Integrations owner** |
| **Subagent** | `Orca` (worker ops), platform channel docs |
| **Estimate** | **1 PD** |
| **Dependencies** | P0-1; `apps/platform/whatsapp` worker running; pairing completed **before** stage; `NAKAMA_SERVER_URL` / Integrations config |
| **Acceptance criteria** | (1) Pre-paired WhatsApp number answers FAQ-style laundry prompts (hours, pricing template, order status script). (2) Assign `send_whatsapp_artifact` if file send is in script. (3) Documented `/stop`, `/new` for presenter. (4) Fallback in demo script if bridge offline. (5) Channel prompt rules respected (simple bold/italic only). |

---

### P0-4 — Agent: Data analyst (forecasting + weather API)

| Field | Value |
|---|---|
| **Owner** | Human: **Data / integrations engineer** |
| **Subagent** | `Marcus Webb` (custom JS tool), `Anvil` if heavy tool code |
| **Estimate** | **1 PD** |
| **Dependencies** | P0-1; custom tool in org tools dir **or** MCP; weather API URL + key in managed secrets / env; sample CSV in profile KB or Data View sheet |
| **Acceptance criteria** | (1) Agent answers: "load vs weather next 7 days" using **real weather API** (not invented). (2) Forecast uses **user-provided or sheet-backed** historical loads (no fake DB). (3) Output is plain language + optional small HTML widget (Owner allows). (4) Tool failures → clear user message, no hallucinated numbers. (5) Rehearsed demo prompt documented in P0-10. |

---

### P0-5 — Agent: Finance (Dimas) — Data View / Google Sheets

| Field | Value |
|---|---|
| **Owner** | Human: **Finance demo script owner** |
| **Subagent** | `Serena Blackwood` (fixtures), plugin docs |
| **Estimate** | **0.75 PD** |
| **Dependencies** | P0-1; official **Data View** plugin enabled ([`packages/plugins/data-view`](./plugins.md)); sample Sheet synced with laundry P&amp;L **synthetic** rows |
| **Acceptance criteria** | (1) Dimas answers cash flow / margin questions from **sheet data**, not from unstated assumptions. (2) INSTRUCTIONS require user to type or confirm numbers when sheet empty. (3) **No stock/risk module** — narrative stays spreadsheet + interpretation. (4) One plugin page or chat path demo'd without opening Advanced rail. (5) Sheet connection stable after one reconnect procedure documented. |

---

### P0-6 — Agent: Visibility (Apify scraping)

| Field | Value |
|---|---|
| **Owner** | Human: **Integrations engineer** |
| **Subagent** | `Marcus Webb` (tool/MCP), `Research` / web for Apify actor choice |
| **Estimate** | **1.25 PD** |
| **Dependencies** | P0-1; **Apify API key** received; custom tool or Composio/MCP path chosen; legal/ethics note for public scraping only |
| **Acceptance criteria** | (1) Agent can run **one documented Apify workflow** (e.g. Maps/search results scrape) and summarize laundry-relevant visibility (competitors, listings). (2) No claim of official Google Business Profile API unless implemented. (3) Grab/Gojek: **explicit stub or scrape-only** with disclaimer. (4) Rate limits and empty results handled gracefully. (5) API key not in pack or git. |

---

### P0-7 — Agent: Operations

| Field | Value |
|---|---|
| **Owner** | Human: **Product** |
| **Subagent** | `skill-reviewer` (`create-automation` skill alignment) |
| **Estimate** | **0.5 PD** |
| **Dependencies** | P0-1; one **manual or cron** automation example optional |
| **Acceptance criteria** | (1) Ops agent covers staffing, SLAs, machine downtime checklist, opening/closing SOPs in laundry voice. (2) Can reference **one** automation ("reminder Friday inventory") without editing automations on stage. (3) Uses artifacts for checklist export if prompted. (4) Does not require `skill_manage` during demo. |

---

### P0-8 — ChatGPT-simple UI pass (Owner mode, 40+ users)

| Field | Value |
|---|---|
| **Owner** | Human: **UX lead** |
| **Subagent** | `Aditi Sharma` (UX), `code-simplifier` (small UI diffs **post-approval only** — out of scope until after this doc) |
| **Estimate** | **1–2 PD** (0.5 PD if flags/copy only; 2 PD if composer + tool UI) |
| **Dependencies** | P0-0; `OwnerTeamSidebar`, `ui-mode.ts`, `chat-page-content.tsx`; decision on demo-only flag vs product change |
| **Acceptance criteria** | (1) Demo user lands in **Owner** with sidebar = six agents only (no surprise Advanced). (2) Composer: model/thinking/token UI **hidden or collapsed** for demo profile/org. (3) Tool calls show **"Working…"** not raw JSON (or collapsed by default). (4) **Advanced** and command palette **disabled or hard-to-find** for demo role (config documented). (5) Default chat language **English** for demo org. (6) Non-technical tester (40+) completes: pick agent → ask one question → read answer **without help** in &lt;3 minutes. |

---

### P0-9 — Onboarding: business type → vertical pack

| Field | Value |
|---|---|
| **Owner** | Human: **Product** |
| **Subagent** | `Vera Sterling` (flow), `Aditi Sharma` (UI copy) |
| **Estimate** | **1 PD** (0.5 PD if "Laundry" card only; 1 PD if generic vertical router) |
| **Dependencies** | P0-1; `use-chat-onboarding.ts`, `chat-onboarding.tsx`; pack import hook |
| **Acceptance criteria** | (1) First visit (or setup) asks **business type**; **Laundry** option visible. (2) Choosing Laundry triggers pack load or switches to Laundry org (defined behavior, no silent failure). (3) Goal/onboarding copy laundry-themed (not generic marketing grid only). (4) Skipping still allows chat with default bot. (5) Behavior documented for summit vs fresh install. |

---

### P0-10 — Demo script & presenter assets

| Field | Value |
|---|---|
| **Owner** | Human: **Demo lead** |
| **Subagent** | `record-demo` skill author / presenter |
| **Estimate** | **0.5 PD** |
| **Dependencies** | P0-1–P0-9 stable; P0-11 URL/copy aligned; **P0-12** recommended so agent beats use real business facts; optional MP4 via BrowserOS |
| **Acceptance criteria** | (1) **8–12 minute** script: intro → one beat per agent (90s max each) → wrap. (2) Exact prompts verbatim; expected screenshots described. (3) Pre-flight checklist (health, WhatsApp, Apify, Sheet, weather). (4) **Do-not-show** list: MCP, providers, workers, payment. (5) Q&amp;A fallbacks (honest limits on social post, GBP, stock). (6) Optional **60s** beat: show landing → waitlist (no live signup). |

---

### P0-11 — Summit landing page (waitlist only)

| Field | Value |
|---|---|
| **Owner** | Human: **GTM + frontend lead** |
| **Subagent** | `Aditi Sharma` (layout/UX), `Webdesign` (visual polish), `Marcus Webb` (`apps/web` route + form) |
| **Estimate** | **1–1.5 PD** |
| **Dependencies** | P0-0 (public URL / deploy); copy aligned with P0-2–P0-7 narratives; **`apps/web`** stack (Vite/React, existing design tokens — no new marketing site repo) |
| **Acceptance criteria** | (1) **ChatGPT-simple** visual: generous whitespace, one column, large type, minimal chrome — readable by **40+** non-technical visitors on phone and laptop. (2) **Hero** states Airin as an **AI agent system for laundry SMEs** (not generic “chatbot”). (3) **Feature sections** (scannable, no jargon): **social content planning**; **WhatsApp customer support**; **data analyst** with **forecasting + weather**; **finance** via **Google Sheets / Data View** (position as sheets-backed insights; no live stock trading claims); **visibility** via **Google Maps + Apify** scraping (honest “insights from public listings” wording). (4) Single **CTA = waitlist form only** with fields: **name**, **business name**, **WhatsApp number**, **email**. (5) **No** account signup, login, payment, or “Start free trial” on this page. (6) Successful submit shows clear confirmation; submissions stored via agreed backend (e.g. server route + DB/CSV, or external form endpoint) — document where leads land. (7) Lighthouse/accessibility: form labels, focus order, errors in plain language. (8) Linked from demo script / QR at summit; does not require platform admin to view. |

---

### P0-12 — Business profile / org knowledge base (laundry context)

| Field | Value |
|---|---|
| **Owner** | Human: **Product + platform admin** |
| **Subagent** | `Serena Blackwood` (data model), `Marcus Webb` (settings + injection), `Aditi Sharma` (owner-facing form) |
| **Estimate** | **1–2 PD** |
| **Dependencies** | **P0-9** (onboarding can collect business type **and** first-pass business fields); P0-1 (laundry pack agents in org); org-scoped storage (distinct from chat **MEMORY** and per-profile soul); existing org KB or settings patterns in BRD §5 where applicable |
| **Acceptance criteria** | (1) Owner can **view and edit** structured business info in **Settings** (and optional step during onboarding after Laundry is chosen): **business name**, **address**, **services**, **pricing**, **hours**, **WhatsApp number**, **Google Maps link**, **brand tone**, and related laundry fields as defined in spec. (2) Data is stored as an **org-scoped business profile / knowledge base** — not ad-hoc MEMORY snippets; survives **sessions and server restarts**. (3) All six laundry agents (**Sari, Ardi, Dimas, Gilang, Rina, Toni**) receive this context automatically in prompts/context assembly so answers use real business facts **without** the owner retyping them each chat. (4) Agents must **not** invent placeholders like `[NAMA LAUNDRY]` / `[alamat]` when profile fields are filled; when fields are empty, one short ask or explicit “belum diisi” per field, not repeated every turn. (5) Documented permission model: org **admin** (or owner role) edits; members read-only unless product decides otherwise. (6) Demo rehearse: Sari carousel / captions use saved name, hours, and price after profile is filled once. |

---

### P0 summary (calendar-critical path)

| Order | ID | Blocker? |
|---|---|---|
| 1 | P0-0 | Yes |
| 2 | P0-1 | Yes |
| 3 | P0-4, P0-5, P0-6 | Parallel after P0-1 |
| 4 | P0-2, P0-3, P0-7 | Parallel |
| 5 | P0-8, P0-9, **P0-11**, **P0-12** | Can trail agents; **P0-11** / **P0-12** parallel to P0-8; **P0-12** after or with P0-9; finish before dress rehearsal |
| 6 | P0-10 | Last |

**P0 total (serial upper bound):** ~**10.5–13 PD** engineering + product (includes **P0-11**, **P0-12**); compress with parallel owners.

**P0 item count:** gate **P0-0** + **P0-1 … P0-12** (12 delivery items).

---


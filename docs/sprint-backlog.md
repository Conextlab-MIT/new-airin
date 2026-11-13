# Sprint backlog — Laundry Innovation Summit demo & post-summit hardening

| Field | Value |
|---|---|
| Sprint | Laundry Innovation Summit (demo) + hardening |
| Product baseline | Airin (renamed from nakama) **v0.4.74** |
| As-is reference | [`docs/current-state-brd-prd.md`](./current-state-brd-prd.md) (track in git) |
| Repo state (as of planning) | `main`, ~**1,514** dirty paths from nakama→Airin rename; **not** a clean production baseline |
| Constraints | Keep full platform capability; simplify **Owner** UX for 40+ non-technical users; no payment/super-admin scope in P0 |
| Out of scope (P0) | Production payment rails, full super-admin productization, first-class finance/stock/GBP modules, self-serve signup from landing |
| External inputs | Composio connected; **Apify API key** incoming for visibility scraping |

**Estimates:** person-days (PD) for a single engineer unless noted; parallel work can compress calendar time.

**Owner legend:** **Human** roles for accountability; **Subagent** = suggested Cursor agent type for scoped execution (not a substitute for human sign-off on demo day).

---

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
| **Dependencies** | P0-1–P0-9 stable; P0-11 URL/copy aligned; optional MP4 via BrowserOS |
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

### P0 summary (calendar-critical path)

| Order | ID | Blocker? |
|---|---|---|
| 1 | P0-0 | Yes |
| 2 | P0-1 | Yes |
| 3 | P0-4, P0-5, P0-6 | Parallel after P0-1 |
| 4 | P0-2, P0-3, P0-7 | Parallel |
| 5 | P0-8, P0-9, **P0-11** | Can trail agents; **P0-11** parallel to P0-8; all must finish before dress rehearsal |
| 6 | P0-10 | Last |

**P0 total (serial upper bound):** ~**9.5–11 PD** engineering + product (includes **P0-11**); compress with parallel owners.

**P0 item count:** gate **P0-0** + **P0-1 … P0-11** (11 delivery items).

---

## P1 — Post-summit hardening

### P1-1 — Payment integration

| Field | Value |
|---|---|
| **Owner** | Human: **Product + backend lead** |
| **Subagent** | `Serena Blackwood` (billing spec), `Marcus Webb` (implementation) |
| **Estimate** | **5–10 PD** (gateway choice dependent) |
| **Dependencies** | Commercial packaging decision; no collision with removed org API keys (see BRD §8); PCI scope |
| **Acceptance criteria** | (1) Intent PRD: who pays (install vs org vs seat). (2) At least one provider (Stripe or regional) with test mode. (3) Webhooks idempotent; audit events for money-adjacent actions. (4) No secrets in client. (5) Documented non-goals for open-source core vs managed cloud. |

---

### P1-2 — Super admin dashboard

| Field | Value |
|---|---|
| **Owner** | Human: **Platform product** |
| **Subagent** | `Serena Blackwood` (IA), `Aditi Sharma` (dashboard UX) |
| **Estimate** | **4–8 PD** |
| **Dependencies** | P1-4 clean baseline; existing `PlatformOverviewPage`, audit APIs (BRD §5.18) |
| **Acceptance criteria** | (1) Single surface: orgs, users, health, version, worker status, usage rollup. (2) Actions: disable user, deep-link support, backup trigger (existing capabilities surfaced). (3) RBAC: platform admin only. (4) No raw secrets displayed. (5) Mobile-not-required. |

---

### P1-3 — Clean baseline commit strategy (rename tree)

| Field | Value |
|---|---|
| **Owner** | Human: **Engineering lead** |
| **Subagent** | `ci-investigator`, `modularize-monolith` / release skill if tagged |
| **Estimate** | **1–3 PD** (+ CI burn-in) |
| **Dependencies** | Full `bun test`, `ultracite check`, desktop/worker smoke per README |
| **Acceptance criteria** | (1) **One or few commits** (or merge train) landing nakama→Airin rename without unrelated edits. (2) `CONTRIBUTING.md` and package names consistent. (3) CI green on default branch. (4) Tag **`v0.4.75`** or **`v0.5.0`** with CHANGELOG. (5) Demo pack branch rebased onto clean tag. (6) Document recovery if partial revert needed. |

---

### P1-4 — Production hardening

| Field | Value |
|---|---|
| **Owner** | Human: **Security / SRE** |
| **Subagent** | `Silas Locke` (security review), `review-security` skill |
| **Estimate** | **5–15 PD** (breadth) |
| **Dependencies** | P1-3; `THREAT_MODEL.md`; BRD §7 limits |
| **Acceptance criteria** | (1) Secrets rotation runbook exercised. (2) Rate limits + `AIRIN_TRUST_PROXY` documented for prod. (3) Backup/restore drill on Laundry org + plugins. (4) WhatsApp/Telegram worker supervision (PM2) monitored. (5) Mixed-origin GitHub deps cataloged or pinned. (6) Pen-test findings triaged. (7) RSS sample on Docker install still ≤512 MB core strategy (BRD lean rule). |

---

### P1-5 — Social: posting surface & carousel builder

| Field | Value |
|---|---|
| **Owner** | Human: **Product (growth)** |
| **Subagent** | `Priya Desai`, Composio integration docs |
| **Estimate** | **3–6 PD** |
| **Dependencies** | P1-3; Composio OAuth flows; channel policies |
| **Acceptance criteria** | (1) User can schedule or post via **one** connected network with confirmation step. (2) Carousel = multi-image artifact or Composio action with preview. (3) Clear audit trail. (4) Laundry pack skill updated from draft-only to connected path. |

---

### P1-6 — Image generation wired (product path)

| Field | Value |
|---|---|
| **Owner** | Human: **Platform admin / AI providers** |
| **Subagent** | `Marcus Webb` (`generate_image` already in server) |
| **Estimate** | **1–2 PD** |
| **Dependencies** | Image model in workspace settings; assignment to Social agent |
| **Acceptance criteria** | (1) Social agent has `generate_image` assigned. (2) Provider configured in Settings. (3) Cost/usage visible to admin. (4) Demo script updated optionally. |

---

### P1-7 — Visibility: GBP / Maps first-class or Apify productization

| Field | Value |
|---|---|
| **Owner** | Human: **Integrations** |
| **Subagent** | `Research`, `Marcus Webb` |
| **Estimate** | **3–8 PD** (API route vs scrape) |
| **Dependencies** | Apify key operational from P0-6; Google API quotas if official |
| **Acceptance criteria** | (1) Visibility agent documents **data source** in every answer. (2) Grab/Gojek: scoped MVP or permanent scrape disclaimer. (3) Caching + rate limits. (4) Org-admin enable toggle. |

---

### P1-8 — Finance: beyond user-typed numbers

| Field | Value |
|---|---|
| **Owner** | Human: **Product / finance SME** |
| **Subagent** | `Serena Blackwood` |
| **Estimate** | **4–8 PD** |
| **Dependencies** | Data View maturity; optional ERP/Sheet templates |
| **Acceptance criteria** | (1) Dimas ingests recurring Sheet sync without manual re-type. (2) Scenario templates (pricing change, machine downtime). (3) Still **no** securities/stock claims unless licensed data wired. (4) Regression case for one finance prompt. |

---

### P1-9 — Vertical onboarding router (generalize P0-9)

| Field | Value |
|---|---|
| **Owner** | Human: **Product** |
| **Subagent** | `Vera Sterling`, marketplace team |
| **Estimate** | **3–5 PD** |
| **Dependencies** | P0-9 laundry path; pack format stable |
| **Acceptance criteria** | (1) N≥3 verticals with packs (laundry + 2). (2) Marketplace or import lists vertical packs. (3) Owner mode shows pack agents automatically. (4) Metrics: completion rate of onboarding. |

---

## Cross-cutting risks (P0)

| Risk | Mitigation |
|---|---|
| Dirty tree breaks demo import | Branch from last known good tag; P1-3 before any customer deploy |
| Apify key late | P0-6 stub with cached JSON fixture for stage; live key for backup laptop |
| WhatsApp instability | Web Support agent + recorded clip |
| Indonesian default replies | Force EN on demo org (`chat-prompt` / user language setting) |
| Composio not on stage account | Social stays draft-only; script says so |
| Image gen not wired | Do not demo images in P0 |
| Waitlist form has no backend on demo day | P0-11: mailto/Google Form fallback documented; or minimal POST route before summit |

---

## Document hygiene

| Action | Owner | When |
|---|---|---|
| Track `docs/current-state-brd-prd.md` in git | Demo lead | Before summit |
| Track **`docs/sprint-backlog.md`** (this file) | Demo lead | Now |
| Link sprint backlog from BRD §12 "PRD follow-on" | Product | P1 start |

---

*End of sprint backlog.*

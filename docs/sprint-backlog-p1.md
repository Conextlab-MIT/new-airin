# Sprint backlog — P1 and cross-cutting

Parent: [sprint-backlog.md](./sprint-backlog.md)

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

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

## Parts

1. [P0 — Laundry Innovation Summit demo](./sprint-backlog-p0.md) (P0-0 … **P0-13**)
2. [P1 and cross-cutting](./sprint-backlog-p1.md) — post-summit, risks, hygiene


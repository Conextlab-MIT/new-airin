# Airin — Current-State BRD / Product Baseline

| Field | Value |
|---|---|
| Document type | Brownfield BRD + as-is product inventory (bukan greenfield intent PRD) |
| Product | **Airin** (repo / package name: `airin`) |
| Code baseline | `package.json` version **0.4.74** |
| Verified live | `GET /health` → `ok: true`, `userConfigured: true`, `providerConfigured: true` (localhost:4310) |
| OpenAPI surface | **252** path entries (`/openapi.json`) |
| Sources | `ARCHITECTURE.md`, `GLOSSARY.md`, `AGENTS.md`, `apps/{server,web,cli,desktop}`, `apps/platform/*`, `packages/{core,agent,db,client,plugins}`, `docs/website/content/docs/*`, live health + OpenAPI |
| Purpose | Baseline fitur/aktor/limitasi agar tim bisa menyusun **PRD lengkap untuk yang belum tercover** tanpa menebak kondisi sekarang |
| Out of scope here | Keputusan engineering baru, roadmap prioritas bisnis, hipotesa value (itu PRD intent terpisah) |

## Parts

1. [Product model](./current-state-brd-prd-model.md) — ringkasan, mental model, aktor, arsitektur
2. [Feature catalog](./current-state-brd-prd-catalog.md) — katalog fitur lengkap
3. [Limits and gaps](./current-state-brd-prd-gaps.md) — matriks klien, hard limits, drift, gap analysis, evidence


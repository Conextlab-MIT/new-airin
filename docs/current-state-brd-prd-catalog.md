# Airin BRD — Feature catalog

Parent: [current-state-brd-prd.md](./current-state-brd-prd.md)

## 5. Katalog fitur lengkap

### 5.1 Auth, setup, keamanan akun

| Fitur | Status | Catatan |
|---|---|---|
| First-time setup wizard | Ada | Admin account **atau** backup ZIP import → org → provider (bisa skip) → user context |
| Email/password login | Ada | Session HttpOnly + CSRF |
| MFA TOTP | Ada | Policy install-wide; enrollment wajib bila `mfaRequired` |
| Passkey | Ada | Login + settings |
| Password reset | Ada | Request + complete |
| Org invite accept | Ada | Token URL |
| Browser session list / revoke | Ada | Preferences |
| Local auth token (CLI) | Ada | Platform admin rotate |
| Org API keys (`nk_live`/`nk_test`) | **Dihapus** | Routes 404 |
| External app-user sessions | **Dihapus** | 400 bila dikirim |

### 5.2 Multi-tenancy, org, teams, shared resources

| Fitur | Status | Catatan |
|---|---|---|
| Banyak org per install | Ada | Isolasi `org_id` |
| Active org (header / session) | Ada | `X-Org-Id` atau `active_org_id` |
| Parent org + teams (1 level) | Ada | Nested teams / pindah org existing ke parent: **tidak** |
| Shared publications | Ada | Knowledge, skills, agents, tools, models |
| Team instantiate shared agent | Ada | Instance milik team |
| Invite members (admin/member) | Ada | Manual token bila email gagal |
| Disable/enable user (platform) | Ada | Install-wide |
| Org archive | Ada | Admin card |
| Chat history privacy | Ada | Hanya owner; platform admin deep-link support; channel chats shared by channel users |

### 5.3 Profil / agen

| Fitur | Status | Catatan |
|---|---|---|
| List / select profiles | Ada | Filtered by chat access |
| Create profile | Ada | UI: **platform admin**; API member → private owned |
| Quick create via Super Airin | Ada | `with-super-airin` |
| Clone / move / delete | Ada | Batasan shared/marketplace |
| Import / export pack | Ada | Org admin atau platform admin |
| Soul files SOUL/STYLE/INSTRUCTIONS/MEMORY | Ada | Workspace disk per profile |
| System prompt + change history | Ada | |
| Avatar / character picker | Ada | Marketplace characters |
| Default model + effort/thinking | Ada | |
| ACP agent presets | Ada | Platform admin |
| Channels per profile | Ada | Telegram, WhatsApp, Discord, Slack, Teams |
| Tools / MCP / skills / Composio assignment | Ada | |
| Behavior / ownership assignments | Ada | Org admin atau owner |
| Regression test cases | Ada | Save chat as case + runs |
| Knowledge base (profile + org) | Ada | Attach/detach shared KB |
| Artifacts workspace | Ada | |
| Marketplace install agents | Ada | Member+ browse; install gated |
| Owner mode vs Advanced UI | Ada | Simplified team sidebar vs full rail |

**Soul / prompt layers (runtime order):** soul compose → skills catalog → org MEMORY.md → chat structure/tool instructions → per-turn (todos, matched skills, Composio) → optional KB catalog. Super Airin menambah rules orchestrator.

### 5.4 Chat (web)

| Fitur | Status | Catatan |
|---|---|---|
| Streaming SSE turns | Ada | Stop / regenerate patterns |
| Deep link `/chat/:profileId/:sessionId` | Ada | |
| Attachments (image/doc) | Ada | Cap chat attach **5 MB** |
| Model / provider / effort picker | Ada | |
| Agent todos panel | Ada | |
| Tool call UI + inline HTML artifacts | Ada | Sandboxed iframe |
| Cognito (ephemeral) mode | Ada | Tidak di history/URL; no MEMORY writes |
| Branch session | Ada | API + UX |
| Compact history | Ada | Manual + overflow |
| Questionnaire (`ask_user_question`) | Ada | Web |
| Read-only channel sessions | Ada | Banner view-only |
| Artifact share publish | Ada | Public `/s/:token` |
| BTW side chat | Ada | Lazy host |
| Token usage display | Ada | Preference toggle |
| Onboarding goal + checklist | Ada | Bukan untuk role viewer (legacy check) |
| Plugin / slash composer menus | Ada | |

### 5.5 Agent groups (multi-agent)

| Fitur | Status | Catatan |
|---|---|---|
| Group CRUD per user | Ada | Bukan org-wide admin rail |
| Multi-agent group chat | Ada | Async poll (bukan SSE utama) |
| Group files / memory | Ada | Memory cap **65 536** chars (API schema); workspace helper **4096** chars di path group memory |
| Threads under messages | Ada | |
| Max documents per group message | Ada | **5** |

### 5.6 Automations

| Fitur | Status | Catatan |
|---|---|---|
| Cron / runAt schedules | Ada | Automation worker poll (~5 min configurable) |
| Webhook trigger + secret | Ada | Public signed POST |
| Draft / run / runs history / mark-read | Ada | |
| Agent tools create/list/run/delete | Ada | |
| `skill_manage` di automation | **Ditolak** | Interactive only (web/CLI) |
| Offline without provider | Ada | Worker mode terdokumentasi |

### 5.7 Tools

#### Builtin (dari live `/health`)

`delete_file`, `edit_file`, `email`, `extract_document_text`, `knowledge_base_search`, `list_artifacts`, `read_file`, `search_files`, `sqlite`, `web_fetch`, `web_search`, `write_docx`, `write_file`

#### Server / platform tools (selected)

| Tool | Catatan |
|---|---|
| `bash` | Host-privileged atau remote sandbox; `AIRIN_TENANT_BASH=0` menolak di tenant |
| `sub_agent` | Same profile only; no nesting; max **5** child chats; timeout 5–10 min |
| `save_artifact`, `generate_image` | |
| `browser_*` (6) | Cloud browser |
| Session tools | list/read/close profile sessions |
| `todo_write` / `todo_read` | Internal plan |
| `ask_user_question` | Web questionnaires |
| Skill tools | `load_skill`, `skill_manage` |
| Automation tools | create/list/delete/run/… |
| Channel artifact send | Discord / WhatsApp |
| `send_to_bot` | Message profil lain in-org |
| Super Airin suite | create/update/list profiles, tools, groups, propose_tool, submit_plugin_draft, … |

#### Custom tools

- JS: `~/.airin/orgs/{orgId}/tools/*.js`
- Python: `*.py` + workspace root
- Org admin CRUD + playground + credentials
- Email tool config: platform admin

### 5.8 Skills

| Fitur | Status | Catatan |
|---|---|---|
| SKILL.md + optional tool | Ada | Global + profile paths |
| Bundled default skills | Ada | create-automation, manage-skills, skill-installer, update/archive-profile-memory, artifact/slide-deck-design, composio-integrations, airin-guide, grounded-research |
| Super-only bundled | Ada | create-plugin, create-profile, create-skill, coding-agent |
| Opt-in | Ada | agent-browser, google-meet, knowledge-base-wiki |
| Coding backend skills | Ada | codex / claude-code / opencode / pi / cursor (runtime prompts) |
| Marketplace install | Ada | |
| Skill proposals / suggestions / curator | Ada | Org learning presets off/ask/auto |
| Post-turn skill review | Ada | |
| Plugin-declared skills | Ada | In-process plugin `tool.ts` **error** (tidak dijalankan) |

### 5.9 MCP

| Fitur | Status | Catatan |
|---|---|---|
| Transports `http` + `stdio` | Ada | Streamable HTTP (bukan legacy SSE terpisah) |
| Preinstalled Exa + Firecrawl | Ada | |
| OAuth for HTTP MCP | Ada | `needs_auth` |
| Org server CRUD + sync | Ada | Platform admin routes/UI |
| Profile assignment | Ada | Platform admin |
| Result truncate | Ada | **1_000_000** chars; connect timeout 30s; call max 30 min |
| ACP MCP bridge | Ada | Public token POST `/v1/acp-mcp/:token` |

### 5.10 Composio

| Fitur | Status | Catatan |
|---|---|---|
| Toolkit enable / connect / sync | Ada | OAuth callback public |
| Profile toolkit assignment | Ada | |
| `/health` `composioAvailable` | Selalu `false` | Live probe di system status |
| Personal OAuth | Ada | Tied to user + team |

### 5.11 Plugins (official + custom)

| Plugin / area | Status | Catatan |
|---|---|---|
| Plugin lifecycle enable/disable/update/uninstall | Ada | Org admin+ |
| Local npm / release install | Ada | Platform admin |
| UI pages under `/plugins/:id` | Ada | |
| Workers per plugin (≤8) | Ada | Trusted code, **tidak sandboxed** |
| **Workflows** | Official | Step recipes + runs; beda dari automations |
| **Supermemory** | Official | External memory provider |
| **Google Meet** | Official + first-class page | Capture, transcripts, extension, Composio import gating |
| **Data View** | Official | Local Google Sheet copy + Sync |

### 5.12 Org memory & profile memory

| Fitur | Status | Catatan |
|---|---|---|
| Org `MEMORY.md` + facts/search/pin | Ada | Semua org roles dapat injection; proposals perlu review |
| Profile `MEMORY.md` | Ada | Active file **4096 bytes**; archive `memory-archive/YYYY-MM.md` |
| Cognito forbids memory writes | Ada | |
| Compaction | Ada | Tool-output prune lalu LLM summary; keep last **2** turns |

### 5.13 Providers & model routing

| Fitur | Status | Catatan |
|---|---|---|
| Multi provider instances + secrets | Ada | Encrypted `AIRIN_SECRETS_KEY` |
| Device OAuth (xAI, ChatGPT) | Ada | |
| Vision / transcription / image gen / web search / browser routing | Ada | Settings cards |
| Audio transcribe / image generate HTTP | Ada | |
| Org LLM quota + usage charts | Ada | Org admin+ |
| Secrets key rotation | Ada | `AIRIN_SECRETS_KEY_NEXT` one-shot |

### 5.14 Channels (matriks)

| Channel | Pairing | Groups | Commands | Artifacts / files | Format limits | Catatan khusus |
|---|---|---|---|---|---|---|
| **Web** | N/A | Agent groups | Full UI | Full | HTML widgets | Primary surface |
| **CLI** | Local/remote login | — | `/help` `/compact` `/soul` `/model` … | Terminal | TTY required for login | `skill_manage` OK; no admin UI |
| **Desktop** | Bundled local server | Via web UI | Same as web | Same | Mic/camera/notifications **off** | Data `~/.airin-desktop` terpisah; workers only while open |
| **Telegram** | Ya (bukan di group) | @mention/reply/slash | Rich slash | Photos/docs ≤5 MB; share links | 4096 split; no tables/long code | Managed-bot pairing optional |
| **WhatsApp** | Ya | mention/reply/`/command` | `!` / shortcuts | `send_whatsapp_artifact` ≤16 MiB; save ≠ send | No rich markdown | Baileys bridge |
| **Discord** | Ya | Guild + threads | Slash `/start`…`/resume` | `send_discord_artifact` | No full tables | |
| **Slack** | **DM only** | Channel @mention | `!` prefix | Reactions “eyes” | Replay age / chat lock | Socket Mode |
| **Teams** | Ya | Channel @mention; **no group chats** | `!` | **No file delivery** | ~6000 chars; activity rate limits | Public inbound message route |

Semua channel: base commands `!help|!new|!clear|!stop|!status` (variasi per channel). Email tool **ditolak** di messaging channels (tidak ada Airin user identity).

### 5.15 Files, artifacts, knowledge

| Fitur | Status | Catatan |
|---|---|---|
| Browse Files page | Ada | Admin: semua; member: milik sendiri |
| Folders / pins / rename / delete | Ada | |
| Knowledge tab | Ada | |
| Public artifact share | Ada | |
| KB zip upload | Ada | Cap **20 MB** |
| `extract_document_text` | Ada | **Tanpa OCR** scanned PDF |

### 5.16 Notifications & presence

| Fitur | Status | Catatan |
|---|---|---|
| In-app notifications feed | Ada | |
| Web push | Ada | Public key + subscription |
| Notification destinations (webhook/email) | Ada | HMAC inbound `/v1/notify/:id` |
| Telegram notification docs | Ada | Docs site |

### 5.17 Coding agents / ACP / browser

| Fitur | Status | Catatan |
|---|---|---|
| Coding harness settings | Ada | |
| ACP presets + per-session settings | Ada | Stub binaries sampai postinstall di beberapa kasus |
| Agent-browser skill + cloud browser tools | Ada | External CLI may still be required |
| Browser session endpoints on chat | Ada | Per-user browser |

### 5.18 Platform ops

| Fitur | Status | Catatan |
|---|---|---|
| Workers start/stop/restart/logs | Ada | Channel: org admin + profileId; automation: platform admin |
| System status / version / upgrade | Ada | `AIRIN_DISABLE_UPDATE_CHECK` menyembunyikan |
| Scheduled encrypted backup | Ada | `AIRIN_BACKUP_DIR` |
| Manual export/import (platform / org / user) | Ada | Archive hingga ~3.5 GiB (env overrides) |
| Setup import | Ada | ≤100 MiB default |
| Audit events (platform) | Ada | List limit ≤200 |
| Metrics `/metrics` | Opt-in | `AIRIN_METRICS=true` |
| Health `/health` `/up` `/readyz` | Ada | |
| OpenAPI + Scalar `/docs` | Ada | |
| PWA service worker update | Ada | Web |
| i18n EN/ID | Ada | |

### 5.19 Deploy surfaces

| Surface | Status |
|---|---|
| Managed hosting (getairin.cloud) | Product path (di luar repo runtime) |
| Docker Compose + single image | Ada |
| Bun `dev:server` / `dev:web` | Ada |
| PM2 ecosystem | Ada |
| Desktop (macOS published; Windows limited) | Ada — lihat `apps/desktop/README.md` |
| Coolify / Tailscale / hardening guides | Docs |

---

---
name: laundry-content-writing-playbook
description: Bahasa Indonesia social copy — Jabodetabek voice, anti-slop, hooks, and channel rules for laundry promos.
---

# Laundry content writing playbook

Adapted from the Hermes content-writing cluster for **Sari** (Jakarta laundry social). Business facts come from org memory, **laundry-local-context**, and user input — never invented prices or hours.

## When

- User wants captions, hooks, carousel slide text, Reels/TikTok scripts, or WA Status copy in Indonesian.
- Draft sounds formal, AI-template, or “iklan korporat”.
- User asks for Jakarta / Jaksel / casual tone, stronger opening, or a rewrite without changing facts.

## Modes (do not cascade)

| Mode | Trigger | Do |
|---|---|---|
| Hook only | “bikin hook”, weak opening | Produce hook candidates; keep body unless asked |
| Anti-slop only | “terlalu AI”, “kaku” | Rewrite prose; preserve hook angle and facts |
| Dialect only | “lebih Jakarta”, “Jaksel” | Adjust register; do not invent new claims |
| Full pass | “rewrite semua”, “rapikan draft” | fact lock → hook (if weak) → anti-slop → dialect → final QA |

Review/diagnose requests stay **review-only** unless the user asks for a rewrite.

## Pipeline order

**Fact lock → hook → anti-slop → dialect → final QA.**

Dialect runs **after** anti-slop so voice is not flattened, and **before** QA so new filler gets caught.

## Voice (Sari / laundry)

Casual Indonesian. Direct. Observational. Like a savvy teman laundry di Kemang — not sales brochure or kantor.

**Tone test:** knowledgeable friend giving a heads-up, not a salesperson.

**Pronouns**

- `gue/lo` or `aku/kamu` in narration and examples — match **STYLE.md** and the user.
- `kamu/kalian` for broad CTAs. Switch naturally; do not force one set.

**Register ladder (Jabodetabek)**

| Register | Use for laundry | Avoid |
|---|---|---|
| Neutral Jabodetabek | cross-channel captions, safe default | heavy slang |
| Jakarta casual | IG chat, reminders, promo santai | rude by default, fake Betawi |
| Jaksel | urban captions, light English inserts (`express`, `pickup`) | every word English, accent cosplay |
| Bekasi / commuter | logistics, “otw pickup”, macet context | area jokes unless user asks |

Slang is flavor, not identity. No class or ethnicity stereotypes. Meme tone only when asked.

## Anti-slop (diagnose patterns)

| Pattern | Signal | Repair |
|---|---|---|
| Canned opening | “Di era digital…”, throat-clearing | Start at concrete offer or scene |
| Empty abstraction | “solusi terbaik”, “inovasi” without object | Name service, price band, who benefits |
| Fake contrast | “bukan cuma X tapi Y” vague | State real distinction or delete |
| Over-signposting | “penting dicatat”, “pada akhirnya” | Make the point directly |
| Inflated claim | revolutionary, “masa depan sudah di sini” | Calibrated outcome from memory/user |
| Generic CTA | “gimana menurut kamu?” disconnected | One question tied to promo tension |
| Report register | grammar correct but sounds PPT | Rewrite as spoken caption (see STYLE.md) |

**Hard rules**

- Never perform slang (`bestie`, `literally` sprinkled to seem human).
- Lock facts: prices, hours, address, WA, promo limits — from org memory or user. You may tone down hype; never strengthen or invent proof.
- **Could-this-be-any-laundry test:** swap business name; if it still works, add specifics.

## Hooks (short openings)

Every hook should create honest curiosity; the body must pay it off.

**Pillars:** Gain (mau hemat/wangi/cepat), Pain (hujan, bau, deadline), Curiosity (kok bisa?).

When generating hooks: offer **up to 6 candidates** across at least 3 hook **types** (e.g. math/offer, weather tie-in, contrast, small confession). Label type in one word. End with **Pilihan terkuat:** + reason.

**Gates:** no invented stats, no medical/safety fear without basis, no insulting the customer. Laundry promos use **real** promo patterns from **laundry-promo-patterns** when relevant.

## Claim safety (laundry)

| Say | Not |
|---|---|
| “cuci kiloan dari Rp 8k/kg” (if in memory) | “paling murah se-Jakarta” without proof |
| “express +25% kalau slot ada” | “pasti same-day” |
| “pickup area Kemang” (if true) | “jaminan datang tepat waktu” |
| “bisa chat WA untuk cek antrian” | “antrian real-time” without data |

Keep numbers and service names exact. Do not round prices.

## Channels

**Instagram feed / carousel slide text**

- One headline per slide (~60–90 chars), one body block (~30–35 words).
- Headlines are **spoken** sentences, not slide deck titles.
- Visuals: load **laundry-openrouter-image**; use **laundry-image-aspect-ratio** (when assigned) for model-safe `aspect_ratio`.

**Reels / TikTok (draft script)**

- Hook in first 3–6 seconds. Target ~75–90s unless user wants shorter.
- Shape: Hook → masalah (hujan/bau/sibuk) → solusi layanan → detail simple → CTA WA / walk-in.
- CTA last. Default: comment/DM WA — draft-only unless Composio connected (**laundry-social-media**).

**WhatsApp Status**

- One hook line, one offer, one CTA. Short lines.

**Google Business Profile text**

- Neutral-informal, no hashtag spam, hours and location from memory.

## With other Sari skills

- **laundry-social-media** — calendar workflow, Composio limits, artifacts.
- **laundry-promo-patterns** — rainy-day, weekend bundles.
- **laundry-openrouter-image** — PNG promos, not copy on image unless in `qa_notes`.

## Do not

- Name Hermes/Anjas personas or client docx delivery paths — use Airin **save_artifact** when the owner wants a file.
- Promise auto-post or live scraping without the right tool/skill.
- Dump the full playbook in chat — apply it, output the draft.

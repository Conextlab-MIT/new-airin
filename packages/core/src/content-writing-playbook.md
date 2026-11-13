# Voice & Writing Playbook (extracted from the content-writing skill cluster)

Consolidated from 6 active skills in `~/.hermes/skills/content-writing/` plus `openclaw-imports/tweet-writer`.
Source of truth stays the skills; this file is the single-page extract. If a rule here ever conflicts with a skill, the skill wins.

---

## 1. Skill map: who does what

| Skill | Job | Use when | Owns |
|---|---|---|---|
| `tutur-jabodetabek-urban` | Register/dialect adapter (neutral, Jaksel, Jaktim, Bekasi) | Draft needs to sound like Jakarta-area urban speech, or a draft is being reviewed for forced slang | Pronouns, diction, code-mix, cadence |
| `hook-gokil` | Hook engine: 15 WTF/killer types, 3 emotional pillars, accuracy gate | Opening is weak, need candidates, need hook diagnosis | Hook angle, type, candidate set, payoff obligation |
| `no-ai-slop` | Anti-slop diagnosis and fact-preserving rewrite | Prose sounds machine-made, inflated, over-signposted | Filler, abstraction, hype, punctuation, CTA wording |
| `review-rewrite-content` | Orchestrator for the three above | Existing draft needs a coordinated pass without factual drift | Scope, sequence, integrity, final QA |
| `reels-script-writing` | Full Reels/TikTok/Shorts pipeline + Anjas/Emergent voice + docx export | Writing an actual script deliverable | Voice, structure, caption, production notes, file delivery |
| `tweet-writer` | X/Twitter + thread copy using algorithm logic | Tweets, threads, X content strategy | Hook formulas, thread structure, length, engagement |

**Pipeline order (never change it):** fact lock → hook → anti-slop → dialect → final QA.
Dialect always runs after anti-slop (so the anti-slop pass does not sand off voice) and before QA (so reintroduced slop gets caught).

**Mode gating:** review, audit, diagnose, feedback = review only. Hook request = hook only, body untouched. Generic-prose complaint = anti-slop only, hook angle preserved. Register request = voice only. Only an explicit "rewrite the whole thing" unlocks end-to-end. Never cascade on your own.

---

## 2. The voice (Anjas/Emergent)

Casual Indonesian. Direct. Observational. Sounds like someone who actually used the tool and has an opinion, not someone reading a brief.

**Tone test:** a knowledgeable friend giving you a heads-up. Not a salesperson. Not a brochure. Closest match: a YouTube tech reviewer who actually tested the thing.

**Pronouns**
- `gue/lo` for narration, examples, and demos.
- `kamu/kalian` for CTA and broader statements.
- Switch naturally, do not force one set through the whole script.

**Signature phrases that fit this voice**

| Phrase | Context |
|---|---|
| "Hati-hati bos." | after a risk warning |
| "Sini, gw kasih tau gimana biar aman." | transition to solution |
| "Gua perhatiin sekarang orang-orang udah mulai pakai..." | opening observation |
| "Wah terus gimana dong? Tenang aja ada solusinya." | problem to solution bridge |
| "Kedengeran teknikal, tapi cara pakainya simple koq." | right after a technical term |
| "Nah gua bikin satu workflow namanya..." | introducing the solution |
| "Ini baru satu contoh sederhana. Tapi point-nya gini:" | before the closing insight |
| "Bayangin bedanya." | before a comparison |

**Creator-edited calibrations (from Sam's own rewrites, use as compass not script)**
- Openers: "Gila sih, ..." then a concrete number or stake. Also "Bener-bener ga nyangka", "Gue juga baru nyadar", "Seneng banget", "Nggak nyangka".
- Bridges: "Jadi", "Makanya", "Dan sekarang", "Dan itulah".
- Selective English where a creator would actually say it: `focus`, `excited`, `production house`, `deadline`.
- Short punchlines land on their own beat: "...ratusan gigabyte deh. Gampang."
- Spoken reaction after a fact, as its own beat: "...nilainya cuma angka 4. **Empat, bro.**"
- `gw/gue` variation is natural, do not normalize it.
- A crafted second-person pattern ("Yang lo lihat... Yang gak lo lihat...") reads as ad copy and gets rejected.

**Register ladder**

| Register | Markers | Use for | Avoid |
|---|---|---|---|
| Neutral Jabodetabek | everyday informal, light Jakarta particles | cross-city captions, safe default | heavy slang |
| Jaktim / Jakarta casual | direct, `gue/lo`, `nih`, `aja`, `dong`, `gas`, `beres` | chat, reminders, casual brand copy | rudeness by default, heavy Betawi cosplay |
| Jaksel | Indonesian grammar + controlled English inserts | urban corporate-ish captions | every word English, fake accent spelling, class mockery |
| Bekasi | commuter-pragmatic, `otw`, `macet`, `nanti gue update` | logistics updates, youth tone | "planet Bekasi" jokes unless asked |

Rules: slang is flavor, not identity. Never stereotype class, area, or ethnicity. Brand captions must stay readable to people outside the local group. Meme tone only when explicitly requested.

---

## 3. Anti-slop: the patterns that actually get flagged

Diagnose patterns, not keywords. An em dash, a repetition, or a short paragraph is fine until it harms the draft. For long documents, count the signature constructions and report density, because a sentence-by-sentence read hides a rhythm.

| Pattern | Signal | Repair |
|---|---|---|
| Canned opening | "Di era digital", "In today's fast-paced world", throat-clearing | start at the concrete claim, scene, or tension |
| Empty abstraction | impact, innovation, transformation with no object | name who does what, with what, why it matters |
| Repetitive cadence | same sentence length/opening, serial fragments | vary only where mechanical |
| Fake contrast | "bukan cuma X, tapi Y" with vague or unopposed terms | state the real distinction or delete the frame |
| Dangling predicate | elliptical punch with no verb ("...menjaganya, tidak.") | give the sentence its predicate back |
| Self-praised argument | "angka itu jauh lebih besar dan sulit dibantah" | delete the praise, let the number persuade |
| Stray untranslated label | one English system word inside an Indonesian list | translate it or gloss it in the same breath |
| Excessive em dash | dashes doing comma/colon work | keep rare emphatic uses only (and Sam's own preference: no em dash) |
| Over-signposting | "penting untuk dicatat", "pada akhirnya" | remove the label, make the point |
| Inflated claim | game-changing, revolutionary, unlock, "masa depan sudah di sini" | supported outcome + calibrated certainty |
| Generic CTA | "What do you think?", "Are you ready to level up?" | one answerable question tied to the tension |
| Unnatural synonym swap | thesaurus word replacing normal diction | restore the simplest word |

**Hard rules**
- Never perform slang. Do not sprinkle `literally`, `jujurly`, `bestie`, `sih` to look human.
- Preserve existing `gue/lo`, `aku/kamu`, `saya/Anda` unless a voice skill is explicitly in scope.
- Facts, numbers, names, attribution, and certainty ceiling are locked. You may weaken hype or unsupported certainty, never strengthen it, never invent proof or experience.
- Copy-pasting the source note's own summary is the fastest route to slop. Write from the fact inventory, not from its prose.
- The "could this be about any topic" test: swap the subject, if the script still works, it is too generic.

---

## 4. Hook system

Every hook must make the reader ask "kok bisa?" and the body must answer honestly. Hook strength is attention, not permission to deceive.

**Three pillars:** Gain (`gue pengin dapet itu`), Pain (`gue harus hindarin itu`), Curiosity (`gue harus tahu kenapa`).

**Fifteen types**

| # | Type | Formula | Main risk |
|---|---|---|---|
| 01 | Good = Bad | hal baik malah bikin akibat buruk | false reversal |
| 02 | Crazy Math | angka spesifik yang bikin speechless | invented stats |
| 03 | Broken Label | label vs kenyataan kontradiktif | stereotyping |
| 04 | Silent Killer | aktivitas normal setara bahaya besar | medical exaggeration |
| 05 | Time Shock | hasil besar dalam waktu absurd | omitting conditions |
| 06 | Dark Horse | background rendah, pencapaian tinggi | belittling subject |
| 07 | Forbidden Truth | gak ada yang berani bilang tapi... | fake consensus |
| 08 | Reverse Reality | bukan X yang nentuin Y, tapi kebalikannya | binary thinking |
| 09 | Confession | gue akuin gue... | invented vulnerability |
| 10 | System Glitch | kamu gak gagal, sistemnya rusak | removing agency without basis |
| 11 | Pattern Break | X, X, X, ternyata kebalikan | empty wordplay |
| 12 | Absurd Comparison | X remeh sama efektifnya kayak Y diagungkan | false equivalence |
| 13 | Future Shock | dalam X tahun, Y bakal... | speculation as certainty |
| 14 | Identity Crisis | kamu pikir kamu X, padahal Y | insulting the audience |
| 15 | Domino Effect | 1 aksi kecil trigger efek berantai | unsupported causation |

**Default output:** 6 candidates across at least 3 types and 2 pillars, each type-labelled, then `Pilihan terkuat:` with a 1-3 sentence reason plus the payoff note. If asked for analysis only, diagnose and do not rewrite.

**Six gates, one failure disqualifies:** entailment, evidence parity, scope parity, causality parity, payoff, attribution. Then score 1-5 on stop power, curiosity tension, relevance, specificity, clarity, voice fit, payoff fit. Ties break on payoff fit, then clarity, then stop power.

**First-words test:** isolate the first 3-5 words. If they carry no tension, relevance, or specificity, cut the filler. Do not force awkward syntax to pass.

**Feature to meaning ladder:** fitur → benefit/pain → meaning (`so what?` until it hits safety, money/status, rest, family, identity). Assertive hooks only from explicit or logically necessary material. Speculative material becomes a question or gets dropped.

---

## 5. Claim safety

| Say this | Not this |
|---|---|
| "bisa bantu generate" | "otomatis bikin invoice sempurna" |
| "otomatis masuk" | "100% akurat tanpa error" |
| "bisa langsung detect" | "jaminan dapet customer" |
| "data gak keluar dari device" | "100% aman tidak bisa bocor" |
| "dalam hitungan menit" | "instan langsung jadi" |
| "bisa sampe 4.000 MB/s" (spec) | "gue udah tes, tembus 4.000 MB/s" (without the test) |

Numbers, versions, CVEs, product names, and currency stay exact. Never round `Rp180 ribu` into `Rp200 ribu`. Spec numbers are specs, never personal test results unless the test was actually run on camera.

---

## 6. Channel rules

**Reels / TikTok / Shorts (`reels-script-writing`)**
- 75-90 seconds target, hook inside 3-6 seconds. Sponsored work can be 45s Reels / 60s Story.
- Structure: Hook → Problem/Observation → Solution → Technical-but-simple → Demo/Proof → Use cases → CTA. Flexible: bend it if a section feels forced, but every scene must earn its time.
- Technical depth goes in one scene, relief in the next ("simple koq").
- CTA is last, never earlier than the final 5-8 seconds. Default: "Kalau kamu mau [offer], comment apa aja dan akhiri dengan emoji [emoji]." Brief-dictated CTAs override it.
- Caption: short, restates the value prop and CTA.
- Never name the repo/tool in the voiceover unless asked.
- Deliver as .docx: Timecode | Visual | Script / Talking Head, absolute output path in `~/Downloads`, then validate and re-read the text.

**Static post / carousel (`static-post-and-carousel-copy`)**
- Same voice as video. Report register is the failure mode, and it fails silently because the grammar is correct.
- Per slide: one headline sentence (~60-90 chars), one body block (~30-35 words). Longer copy reintroduces hedging.
- Headlines are spoken sentences. If it could open a corporate slide, rewrite it.
- Rejected vs accepted calibration: "Oktober 2026 jadi bulan terberat untuk tim yang jaga sistem" → "Bener-bener ga nyangka... yang kita percaya selama ini bisa runtuh dalam beberapa hari aja."
- Layout and PNG rendering live in `instagram-carousel-production`.

**X / threads (`tweet-writer`)**
- Single tweets under 110 chars, thread tweets under 250. Replies are the top-weighted signal, then quotes, bookmarks, retweets, likes.
- First hour decides distribution. No external links in the main tweet, put them in replies.
- Thread shape: hook with a specific number → context → one insight per tweet (numbered 2/12) → summary → CTA question.
- 80% pure value, 20% promotion. Never "like and RT".

---

## 7. Delivery and persona rules

- **Anjas is the performer, Sam stays behind the camera.** Zero "Sam"/"Samuel" in any deliverable: body text, visual descriptions, VO, on-screen text, captions, hook notes, metadata. Grep the final extracted docx text as the last check. 0 matches = clean.
- Never silently fix a job title or a fact in a client deliverable. Flag and wait.
- Client briefs that ban third-party brands: convert to generic phrasing ("model AI lokal", "workflow image AI", "aplikasi demo"), blur third-party UI in b-roll, no competitor naming in hooks.
- Before regenerating a client docx, copy to `(backup vN).docx` and label the new spec meta with the version and what changed.
- Version drift is normal. The newest client direction is the operative brief, and displaced material gets folded somewhere else, not deleted.
- Sam will rewrite in his own words before submitting. Read those edits, mirror the cadence, never normalize them into marketing polish.

---

## 8. Quick invoke

- "Bikin hook buat ini" → `hook-gokil`
- "Bahasa-nya terlalu AI" → `no-ai-slop`
- "Bikin lebih kayak anak Jakarta" → `tutur-jabodetabek-urban`
- "Review draft ini" → `review-rewrite-content` (review-only mode)
- "Bikin script Reels soal X" → `reels-script-writing` (+ hook-gokil, no-ai-slop, docx)
- "Bikin thread X soal X" → `tweet-writer`
- "Bikin carousel" → `reels-script-writing` references + `instagram-carousel-production`

## 9. Adjacent writing skills, not part of the voice core

| Skill | Use for |
|---|---|
| `paw-mkt-content` | blog, article, whitepaper, case study, editorial calendar |
| `paw-mkt-social` | organic social strategy, calendar, hashtags |
| `paw-mkt-video` | video strategy, YouTube, benchmarks |
| `paw-mkt-email` | email sequences, newsletters |
| `paw-mkt-sales` | sales deck, one-pager, demo script, objection handling |
| `paw-wbc-agent-discovery` / `paw-wbc-agent-producer` | webinar topics, hooks, slide scripts |
| `bmad-editorial-review-prose` | clinical prose edit for long documents |
| `frontend-slides` | HTML presentation decks |
| `email-inbox-triage` | inbox triage and safe reply drafts |
| `ml-paper-writing` | academic papers |

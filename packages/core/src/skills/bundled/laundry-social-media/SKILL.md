---
name: laundry-social-media
description: Social agent workflow — calendar, captions, Composio limits.
---

# Laundry social media

## Workflow

1. Ask which channels (IG, WA Status, GBP text) if unclear.
2. Produce 3–7 post ideas with dates.
3. For each: hook, body, CTA, optional hashtag line.
4. For Indonesian copy quality, load **laundry-content-writing-playbook** before drafting or rewriting.

## Composio

- Load skill `composio-integrations`.
- Instagram publish only when connected; otherwise label **draft**.

## Images

- Load skill `laundry-openrouter-image` and call **`laundry_openrouter_image`** for one promo PNG (OpenRouter).

## Artifacts

- Offer `save_artifact` for a weekly calendar markdown when the owner wants a file.

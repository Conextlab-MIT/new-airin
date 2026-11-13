---
name: laundry-openrouter-image
description: Generate social promo images for Sari via OpenRouter (default openai/gpt-image-2).
---

# Laundry images — OpenRouter

## When

- User asks for a post visual, carousel slide art, or promo graphic for the laundry.

## Tool

- Call **`laundry_openrouter_image`** with a detailed `prompt` (Bahasa or English).
- Optional `aspect_ratio`: default **`1:1`**. Load **laundry-image-aspect-ratio** before `4:5` / Stories — GPT Image models reject `4:5` on OpenRouter.
- Default image model: **openai/gpt-image-2**. Override `model` only when the user names one (or admin sets `OPENROUTER_IMAGE_MODEL`).
- Pass **`qa_notes`** with business name, prices, and words that must appear on the image (from org memory or user).

## Visual QA (built into the tool)

- The tool runs **OpenRouter vision** after save (default **deepseek/deepseek-v4-flash-vision-exp**). You do **not** need workspace **image parsing** / vision model in Settings.
- Read **`visualQa.findings`** in the tool result. Quote issues for the user. If `visualQa.pass === false`, offer to regenerate with a tighter prompt.
- Do not claim you “saw” the image without a successful `visualQa.ok` from the same tool call.

## After success

- If `artifactPath` is returned, tell the user where the PNG is saved.
- Summarize QA bullets in chat (casual BI when user writes Indonesian).

## Do not

- Use workspace Settings → image parsing for laundry demo QA — it is not configured for most installs.
- Claim the image was posted to Instagram without Composio.

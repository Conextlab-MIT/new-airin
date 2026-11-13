---
name: laundry-image-aspect-ratio
description: OpenRouter image aspect_ratio per model for laundry_openrouter_image — avoid 400 errors.
---

# Laundry image aspect ratio

Use with **`laundry_openrouter_image`**. Tool default `aspect_ratio` is **1:1**. Set `aspect_ratio` on each call.

## Model support (OpenRouter Image API)

Values below are from OpenRouter model docs; unlisted ratios get **400**.

| Model slug | Accepted `aspect_ratio` | Notes |
|---|---|---|
| `openai/gpt-image-2` | `1:1`, `3:2`, `2:3`, `4:3`, `3:4`, `16:9`, `9:16`, `21:9`, `auto` | **No `4:5`**. Default laundry model. |
| `openai/gpt-image-1-mini` | `1:1`, `3:2`, `2:3`, `auto` | **No `4:5`, no `9:16`**. |
| `google/gemini-2.5-flash-image` | `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` | `4:5` OK for portrait/carousel. |
| `google/gemini-3.1-flash-lite-image` | `1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `9:16`, `16:9`, `21:9` | `4:5` and `9:16` OK. |

Admin override: env **`OPENROUTER_IMAGE_MODEL`** replaces default model; pick ratio from that model’s row.

## Sari defaults

| Use | Prefer | With GPT Image models |
|---|---|---|
| IG feed | `1:1` | `1:1` |
| Stories / tall portrait | `9:16` or `2:3` | **`2:3`** or **`9:16`** (not `4:5`) |
| Landscape banner | `16:9` or `3:2` | `16:9` or `3:2` |
| Carousel portrait (Gemini) | `4:5` | Switch model or use `2:3` |

**Avoid `4:5` on GPT Image (`gpt-image-2`, `gpt-image-1-mini`)** unless OpenRouter docs change. For `4:5` art without switching model, use **`2:3`** as closest tall ratio.

## On 400 / aspect_ratio error

1. Read the error for **Accepted:** ratios.
2. Retry same prompt with the nearest supported ratio (e.g. `4:5` → `2:3` for GPT).
3. Tell the user briefly if you changed ratio for model limits.
4. To keep `4:5`, pass `model: google/gemini-2.5-flash-image` (or another Gemini row above).

## Do not

- Assume all models share Instagram-native `4:5`.
- Retry the same failing ratio more than once without changing `aspect_ratio` or `model`.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DEFAULT_MODEL = "openai/gpt-image-2";
const DEFAULT_VISION_MODEL = "deepseek/deepseek-v4-flash-vision-exp";

const QA_SYSTEM = `You are a visual QA reviewer for laundry social graphics. Inspect the image for:
- Misspelled or garbled text (especially brand name, prices, promo words)
- Cropped or unreadable typography, bad contrast, cluttered layout
- Off-brand or misleading claims
Reply in the user's language (default Bahasa Indonesia if unclear). Be brief: 3–6 bullets. End with PASS or FAIL on its own line.`;

/** @param {Record<string, unknown>} input */
/** @param {{ fetch?: typeof fetch; workspaceRoot?: string }} context */
export async function run(input, context) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model =
    typeof input.model === "string" && input.model.trim()
      ? input.model.trim()
      : (process.env.OPENROUTER_IMAGE_MODEL ?? DEFAULT_MODEL).trim();
  const prompt =
    typeof input.prompt === "string" && input.prompt.trim()
      ? input.prompt.trim()
      : "";

  if (!apiKey) {
    return {
      error:
        "OPENROUTER_API_KEY is not set. Ask an admin to add it in tool credentials or server env.",
      ok: false,
    };
  }

  if (!prompt) {
    return { error: "prompt is required.", ok: false };
  }

  const aspectRatio =
    typeof input.aspect_ratio === "string" && input.aspect_ratio.trim()
      ? input.aspect_ratio.trim()
      : "1:1";

  const fetchFn = context?.fetch ?? globalThis.fetch;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer":
      process.env.OPENROUTER_HTTP_REFERER ?? "https://airin.local",
    "X-Title": "Airin Laundry Demo",
  };

  let usage;
  let provider = "openrouter-images";
  let imageBase64;
  let mediaType = "image/png";

  const imagesBody = {
    aspect_ratio: aspectRatio,
    model,
    n: 1,
    prompt,
  };

  const imagesRes = await fetchFn("https://openrouter.ai/api/v1/images", {
    body: JSON.stringify(imagesBody),
    headers,
    method: "POST",
    signal: AbortSignal.timeout(120_000),
  });

  if (imagesRes.ok) {
    const payload = await imagesRes.json();
    usage = payload.usage ?? payload.data?.[0]?.usage;
    const item = Array.isArray(payload.data) ? payload.data[0] : payload;
    imageBase64 =
      item?.b64_json ??
      item?.image?.b64_json ??
      extractBase64FromUrl(item?.url ?? item?.image_url);
    mediaType = item?.mime_type ?? "image/png";
  } else if (imagesRes.status === 404 || imagesRes.status === 405) {
    provider = "openrouter-chat";
    const chatRes = await fetchFn(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        body: JSON.stringify({
          messages: [{ content: prompt, role: "user" }],
          modalities: ["image", "text"],
          model,
        }),
        headers,
        method: "POST",
        signal: AbortSignal.timeout(120_000),
      }
    );

    if (!chatRes.ok) {
      const text = await chatRes.text();
      return {
        error: `OpenRouter image request failed (${chatRes.status}): ${text.slice(0, 240)}`,
        ok: false,
      };
    }

    const chat = await chatRes.json();
    usage = chat.usage;
    imageBase64 = extractImageFromChatMessage(chat);
  } else {
    const text = await imagesRes.text();
    return {
      error: `OpenRouter images API failed (${imagesRes.status}): ${text.slice(0, 240)}`,
      ok: false,
    };
  }

  if (!imageBase64) {
    return {
      error: "OpenRouter returned no image bytes. Try another prompt or model.",
      model,
      ok: false,
      provider,
    };
  }

  let artifactPath;

  if (context.workspaceRoot) {
    const dir = join(context.workspaceRoot, "artifacts");
    await mkdir(dir, { recursive: true });
    const fileName = `laundry-social-${Date.now()}.png`;
    const absolute = join(dir, fileName);
    await writeFile(absolute, Buffer.from(imageBase64, "base64"));
    artifactPath = `artifacts/${fileName}`;
  }

  const cost =
    typeof usage?.cost === "number"
      ? usage.cost
      : typeof usage?.total_cost === "number"
        ? usage.total_cost
        : null;

  const skipQa = input.skip_visual_qa === true;
  let visualQa = null;

  if (!skipQa) {
    const qaUserNotes =
      typeof input.qa_notes === "string" ? input.qa_notes.trim() : "";
    visualQa = await runOpenRouterVisualQa({
      apiKey,
      expectedText: qaUserNotes,
      fetchFn,
      headers,
      imageBase64,
      mediaType,
      originalPrompt: prompt,
      visionModel:
        (typeof input.vision_model === "string" && input.vision_model.trim()) ||
        process.env.OPENROUTER_VISION_MODEL?.trim() ||
        DEFAULT_VISION_MODEL,
    });
  }

  return {
    artifactPath: artifactPath ?? null,
    costUsd: cost,
    mediaType,
    model,
    ok: true,
    promptSummary: prompt.slice(0, 120),
    provider,
    usage: usage ?? null,
    visualQa,
  };
}

async function runOpenRouterVisualQa({
  apiKey,
  expectedText,
  fetchFn,
  headers,
  imageBase64,
  mediaType,
  originalPrompt,
  visionModel,
}) {
  const started = Date.now();
  const dataUrl = `data:${mediaType};base64,${imageBase64}`;

  const userText = [
    "Review this generated promo image.",
    originalPrompt ? `Generation prompt: ${originalPrompt.slice(0, 500)}` : "",
    expectedText ? `Expected text/branding: ${expectedText}` : "",
    "List spelling, layout, and quality issues.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetchFn(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        body: JSON.stringify({
          max_tokens: 600,
          messages: [
            { content: QA_SYSTEM, role: "system" },
            {
              content: [
                { text: userText, type: "text" },
                {
                  image_url: { url: dataUrl },
                  type: "image_url",
                },
              ],
              role: "user",
            },
          ],
          model: visionModel,
        }),
        headers,
        method: "POST",
        signal: AbortSignal.timeout(90_000),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return {
        error: `Vision QA failed (${response.status}): ${text.slice(0, 200)}`,
        model: visionModel,
        ok: false,
        qaElapsedMs: Date.now() - started,
      };
    }

    const payload = await response.json();
    const findings =
      typeof payload?.choices?.[0]?.message?.content === "string"
        ? payload.choices[0].message.content.trim()
        : "";
    const qaCost =
      typeof payload?.usage?.cost === "number"
        ? payload.usage.cost
        : typeof payload?.usage?.total_cost === "number"
          ? payload.usage.total_cost
          : null;
    const pass = /\bFAIL\b/i.test(findings)
      ? false
      : /\bPASS\b/i.test(findings)
        ? true
        : null;

    return {
      findings,
      model: visionModel,
      ok: Boolean(findings),
      pass,
      provider: "openrouter-vision",
      qaCostUsd: qaCost,
      qaElapsedMs: Date.now() - started,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      model: visionModel,
      ok: false,
      qaElapsedMs: Date.now() - started,
    };
  }
}

function extractBase64FromUrl(value) {
  if (typeof value !== "string") {
    return;
  }

  const match = /^data:image\/[a-z0-9.+-]+;base64,(.+)$/i.exec(value);

  return match?.[1];
}

function extractImageFromChatMessage(chat) {
  const message = chat?.choices?.[0]?.message;
  const content = message?.content;

  if (typeof content === "string") {
    return extractBase64FromUrl(content);
  }

  if (Array.isArray(content)) {
    for (const part of content) {
      if (part?.type === "image_url" && part.image_url?.url) {
        const fromUrl = extractBase64FromUrl(part.image_url.url);

        if (fromUrl) {
          return fromUrl;
        }
      }

      if (part?.type === "image" && part.image?.url) {
        const fromUrl = extractBase64FromUrl(part.image.url);

        if (fromUrl) {
          return fromUrl;
        }
      }

      if (part?.inline_data?.data) {
        return part.inline_data.data;
      }
    }
  }

  if (Array.isArray(message?.images)) {
    for (const image of message.images) {
      const fromUrl = extractBase64FromUrl(image?.image_url?.url ?? image?.url);

      if (fromUrl) {
        return fromUrl;
      }
    }
  }
}

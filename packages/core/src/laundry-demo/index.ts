import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  LaundryDemoToolTemplate,
  LaundryDemoToolTemplateId,
} from "./types";

export {
  LAUNDRY_INNOVATION_SUMMIT_PACK_ID,
  type LaundryDemoToolTemplate,
  type LaundryDemoToolTemplateId,
} from "./types";

const TEMPLATE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "tool-templates"
);

export const LAUNDRY_DEMO_TOOL_TEMPLATES: readonly LaundryDemoToolTemplate[] = [
  {
    description:
      "Fetch a 7-day OpenWeather forecast and estimate laundry load from rain and heat.",
    env: [{ name: "OPENWEATHER_API_KEY" }],
    handlerConfigParameters: {
      properties: {
        baselineDailyLoadKg: {
          description: "Baseline kg/day when no historical row exists.",
          type: "number",
        },
        city: { description: "City for weather lookup.", type: "string" },
        dailyLoadsKg: {
          additionalProperties: { type: "number" },
          description: "Optional map of YYYY-MM-DD to historical load kg.",
          type: "object",
        },
        days: { description: "Forecast days (1–7).", type: "number" },
      },
      required: [],
      type: "object",
    },
    id: "laundry-weather-forecast",
    moduleFileName: "laundry-weather-forecast.js",
    name: "laundry_weather_forecast",
  },
  {
    description:
      "Run a documented Apify Google Places scrape and return competitor listings.",
    env: [{ name: "APIFY_API_KEY" }, { name: "APIFY_MAPS_ACTOR_ID" }],
    handlerConfigParameters: {
      properties: {
        maxPlaces: { description: "Max places to return.", type: "number" },
        searchQuery: {
          description: "Maps search query.",
          type: "string",
        },
      },
      required: ["searchQuery"],
      type: "object",
    },
    id: "laundry-apify-maps-reviews",
    moduleFileName: "laundry-apify-maps-reviews.js",
    name: "laundry_apify_maps_reviews",
  },
  {
    description:
      "Generate a laundry promo/social image via OpenRouter (default openai/gpt-image-2). Saves PNG under artifacts/, then runs OpenRouter vision QA (default deepseek/deepseek-v4-flash-vision-exp).",
    env: [{ name: "OPENROUTER_API_KEY" }],
    handlerConfigParameters: {
      properties: {
        aspect_ratio: {
          description: "Aspect ratio, e.g. 1:1, 4:5, 9:16, 16:9.",
          type: "string",
        },
        model: {
          description:
            "OpenRouter image model slug (default openai/gpt-image-2).",
          type: "string",
        },
        prompt: { description: "Image prompt.", type: "string" },
        qa_notes: {
          description:
            "Expected on-image text (business name, price) for visual QA.",
          type: "string",
        },
        skip_visual_qa: {
          description: "Set true to skip post-generation vision QA.",
          type: "boolean",
        },
        vision_model: {
          description:
            "OpenRouter vision model for QA (default deepseek/deepseek-v4-flash-vision-exp).",
          type: "string",
        },
      },
      required: ["prompt"],
      type: "object",
    },
    id: "laundry-openrouter-image",
    moduleFileName: "laundry-openrouter-image.js",
    name: "laundry_openrouter_image",
  },
] as const;

export function laundryDemoToolTemplatePath(
  templateId: LaundryDemoToolTemplateId
): string {
  const template = LAUNDRY_DEMO_TOOL_TEMPLATES.find(
    (entry) => entry.id === templateId
  );

  if (!template) {
    throw new Error(`Unknown laundry demo tool template: ${templateId}`);
  }

  return path.join(TEMPLATE_DIR, template.moduleFileName);
}

export function getLaundryDemoToolTemplate(
  templateId: LaundryDemoToolTemplateId
): LaundryDemoToolTemplate | null {
  return (
    LAUNDRY_DEMO_TOOL_TEMPLATES.find((entry) => entry.id === templateId) ?? null
  );
}

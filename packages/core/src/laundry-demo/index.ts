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

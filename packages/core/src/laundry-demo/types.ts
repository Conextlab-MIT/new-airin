export const LAUNDRY_INNOVATION_SUMMIT_PACK_ID = "laundry-innovation-summit";

export type LaundryDemoToolTemplateId =
  | "laundry-weather-forecast"
  | "laundry-apify-maps-reviews"
  | "laundry-openrouter-image";

import type { JsonSchema } from "../contract";

export interface LaundryDemoToolTemplate {
  description: string;
  env: { name: string }[];
  handlerConfigParameters: JsonSchema;
  id: LaundryDemoToolTemplateId;
  moduleFileName: string;
  name: string;
}

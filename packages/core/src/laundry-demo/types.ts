export const LAUNDRY_INNOVATION_SUMMIT_PACK_ID = "laundry-innovation-summit";

export type LaundryDemoToolTemplateId =
  | "laundry-weather-forecast"
  | "laundry-apify-maps-reviews"
  | "laundry-openrouter-image";

export interface LaundryDemoToolTemplate {
  description: string;
  env: { name: string }[];
  handlerConfigParameters: Record<string, unknown>;
  id: LaundryDemoToolTemplateId;
  moduleFileName: string;
  name: string;
}

import {
  Analytics01Icon,
  Building03Icon,
  Mail01Icon,
  Megaphone01Icon,
  PlusSignIcon,
  Search01Icon,
} from "hugeicons-react";
import type { ComponentType } from "react";
import { LAUNDRY_GOAL_SUGGESTIONS } from "@/lib/business-vertical";

type IconComponent = ComponentType<{ className?: string }>;

const LAUNDRY_GOAL_ICONS: IconComponent[] = [
  Megaphone01Icon,
  Mail01Icon,
  Analytics01Icon,
  Building03Icon,
  Search01Icon,
];

export const LAUNDRY_GOAL_OPTIONS = LAUNDRY_GOAL_SUGGESTIONS.map(
  (label, index) => ({
    icon: LAUNDRY_GOAL_ICONS[index] ?? PlusSignIcon,
    label,
  })
);

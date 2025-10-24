import { InsightData } from "@/app/components/Desktop";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortByPriorityAndConfidence(
  a: InsightData,
  b: InsightData,
): number {
  // Define priority order
  const priorityOrder = { "HIGH": 3, "MID": 2, "LOW": 1 };

  // First sort by priority (HIGH first)
  const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  // If priorities are equal, sort by confidence (highest first)
  return b.confidence - a.confidence;
}

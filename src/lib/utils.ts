import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbbreviation(text: string) {
  return text.slice(0, 2).toUpperCase();
}

export function formatTagsToArray(tags: string) {
  return tags
    .trim()
    .split("#")
    .filter((val) => val)
    .map((t) =>
      t
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .toLowerCase(),
    );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeFileName(name: string): string {
  // Normalize the text to decompose special characters into base characters
  const normalized = name.normalize('NFD');
  // Filter out combining marks (e.g., accents)
  const asciiText = Array.from(normalized)
      .filter(char => !char.match(/[\u0300-\u036f]/))
      .join('');
  // Remove unwanted characters except hyphens
  const cleanedText = asciiText.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s-]/g, '');
  // Convert to lowercase and replace spaces/tabs/newlines with hyphens
  return cleanedText
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\t+/g, '-')
      .replace(/\n+/g, '-');
}

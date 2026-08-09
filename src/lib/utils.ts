import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals: number = 2): number {
  return Number(val.toFixed(decimals));
}

export function generateId(prefix: string = "obj"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

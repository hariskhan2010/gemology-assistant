import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

export type Easing = [number, number, number, number];

export const easeOut: Easing = [0.25, 0.46, 0.45, 0.94];

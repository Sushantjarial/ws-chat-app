import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomColor(): string {
  // Generate elegant, muted colors that work well with dark backgrounds
  const hues = [180, 190, 200, 210, 220, 230, 240, 250] // Teal, blue, indigo hues
  const hue = hues[Math.floor(Math.random() * hues.length)]
  const saturation = 30 + Math.floor(Math.random() * 20) // 30-50%
  const lightness = 60 + Math.floor(Math.random() * 10) // 60-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

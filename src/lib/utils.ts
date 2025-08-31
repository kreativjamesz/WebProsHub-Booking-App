import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Export cookie utilities
export * from './utils/cookies';

// Export route guard utilities
export * from './utils/route-guards';

// Export storage utilities
export * from './utils/storage';

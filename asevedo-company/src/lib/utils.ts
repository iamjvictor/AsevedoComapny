/**
 * Utility functions for the application
 * Contains helper functions for class name manipulation and other common operations
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and merges Tailwind classes
 * Useful for conditionally applying classes and avoiding conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

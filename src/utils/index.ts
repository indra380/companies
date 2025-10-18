// Simple class name utility to replace clsx
type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

/**
 * Utility function for combining and conditionally applying CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (typeof input === 'object' && !Array.isArray(input)) {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    }
  }
  
  return classes.join(' ');
}

/**
 * Debounce function to limit the rate at which a function can fire
 * Useful for search inputs and API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format large numbers with proper suffixes (K, M, B)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['', 'K', 'M', 'B', 'T'];
  
  const i = Math.floor(Math.log(num) / Math.log(k));
  
  if (i === 0) return num.toString();
  
  return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

/**
 * Format currency values with proper symbols
 * @param amount - The amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format dates in a human-readable format
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Calculate time ago from a given date
 * @param date - Date string or Date object
 */
export function timeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInMins > 0) {
    return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random color for avatars or placeholders
 * @param seed - String to seed the color generation
 */
export function generateColor(seed: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#6C5CE7', '#A29BFE', '#FD79A8',
    '#E84393', '#00B894', '#00CEC9', '#6C5CE7', '#FDCB6E'
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get company size display name
 * @param size - Company size enum value
 */
export function getCompanySizeDisplay(size: string): string {
  const sizeMap: Record<string, string> = {
    startup: 'Startup (1-10)',
    small: 'Small (11-50)',
    medium: 'Medium (51-250)',
    large: 'Large (251-1000)',
    enterprise: 'Enterprise (1000+)'
  };
  
  return sizeMap[size] || size;
}

/**
 * Get funding stage display name with colors
 * @param stage - Funding stage enum value
 */
export function getFundingStageDisplay(stage: string): { name: string; color: string } {
  const stageMap: Record<string, { name: string; color: string }> = {
    'pre-seed': { name: 'Pre-Seed', color: 'bg-gray-100 text-gray-800' },
    'seed': { name: 'Seed', color: 'bg-green-100 text-green-800' },
    'series-a': { name: 'Series A', color: 'bg-blue-100 text-blue-800' },
    'series-b': { name: 'Series B', color: 'bg-purple-100 text-purple-800' },
    'series-c': { name: 'Series C', color: 'bg-indigo-100 text-indigo-800' },
    'series-d': { name: 'Series D+', color: 'bg-pink-100 text-pink-800' },
    'ipo': { name: 'IPO', color: 'bg-yellow-100 text-yellow-800' },
    'acquired': { name: 'Acquired', color: 'bg-orange-100 text-orange-800' },
    'bootstrap': { name: 'Bootstrap', color: 'bg-emerald-100 text-emerald-800' }
  };
  
  return stageMap[stage] || { name: stage, color: 'bg-gray-100 text-gray-800' };
}

/**
 * Validate email format
 * @param email - Email string to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param url - URL string to validate
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert string to slug format
 * @param text - Text to convert to slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Get initials from a name
 * @param name - Full name string
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to save ${key} to localStorage`);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`Failed to remove ${key} from localStorage`);
    }
  }
};

/**
 * Copy text to clipboard
 * @param text - Text to copy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
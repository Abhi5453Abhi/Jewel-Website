/**
 * Image caching utility using localStorage for performance
 * Stores image data URLs in localStorage to avoid repeated network requests
 */

const CACHE_PREFIX = "img_cache_";
const CACHE_EXPIRY_DAYS = 7; // Images cached for 7 days
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB max cache size

interface CacheEntry {
  dataUrl: string;
  timestamp: number;
  size: number;
}

/**
 * Convert image URL to base64 data URL and cache it
 */
async function imageToDataUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to data URL:", error);
    throw error;
  }
}

/**
 * Get cache key for an image URL
 */
function getCacheKey(url: string): string {
  return CACHE_PREFIX + btoa(url).replace(/[/+=]/g, "");
}

/**
 * Check if cache entry is expired
 */
function isExpired(entry: CacheEntry): boolean {
  const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - entry.timestamp > expiryTime;
}

/**
 * Get total cache size
 */
function getCacheSize(): number {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const entry = JSON.parse(localStorage.getItem(key) || "{}");
        totalSize += entry.size || 0;
      } catch {
        // Ignore invalid entries
      }
    }
  }
  return totalSize;
}

/**
 * Clear oldest cache entries if cache is too large
 */
function clearOldCache(): void {
  const entries: Array<{ key: string; timestamp: number }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const entry = JSON.parse(localStorage.getItem(key) || "{}");
        entries.push({ key, timestamp: entry.timestamp || 0 });
      } catch {
        // Remove invalid entries
        if (key) localStorage.removeItem(key);
      }
    }
  }
  
  // Sort by timestamp (oldest first)
  entries.sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove oldest entries until under limit
  let currentSize = getCacheSize();
  for (const entry of entries) {
    if (currentSize < MAX_CACHE_SIZE) break;
    try {
      const cached = JSON.parse(localStorage.getItem(entry.key) || "{}");
      currentSize -= cached.size || 0;
      localStorage.removeItem(entry.key);
    } catch {
      localStorage.removeItem(entry.key);
    }
  }
}

/**
 * Get cached image or fetch and cache it
 */
export async function getCachedImage(url: string): Promise<string> {
  // If it's already a data URL, return as is
  if (url.startsWith("data:")) {
    return url;
  }

  // If it's a local path, return as is (no caching needed)
  if (url.startsWith("/")) {
    return url;
  }

  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const entry: CacheEntry = JSON.parse(cached);
      
      // Check if expired
      if (isExpired(entry)) {
        localStorage.removeItem(cacheKey);
      } else {
        // Return cached data URL
        return entry.dataUrl;
      }
    } catch {
      // Invalid cache entry, remove it
      localStorage.removeItem(cacheKey);
    }
  }

  // Fetch and cache the image
  try {
    const dataUrl = await imageToDataUrl(url);
    const size = new Blob([dataUrl]).size;
    
    const entry: CacheEntry = {
      dataUrl,
      timestamp: Date.now(),
      size,
    };

    // Check cache size and clear old entries if needed
    const currentSize = getCacheSize();
    if (currentSize + size > MAX_CACHE_SIZE) {
      clearOldCache();
    }

    localStorage.setItem(cacheKey, JSON.stringify(entry));
    return dataUrl;
  } catch (error) {
    console.error("Error caching image:", error);
    // Return original URL if caching fails
    return url;
  }
}

/**
 * Preload and cache multiple images
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => getCachedImage(url).catch(() => {})));
}

/**
 * Clear all cached images
 */
export function clearImageCache(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const entry: CacheEntry = JSON.parse(
          localStorage.getItem(key) || "{}"
        );
        if (isExpired(entry)) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}


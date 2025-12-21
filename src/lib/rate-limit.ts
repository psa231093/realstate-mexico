/**
 * Simple in-memory rate limiting for API routes.
 * For production with multiple instances, use Redis-based solution like @upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store - Note: This resets on server restart and doesn't work across multiple instances
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier (usually IP address or user ID)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback - in development this might be localhost
  return "127.0.0.1";
}

// Preset configurations for different API types
export const RATE_LIMITS = {
  // General API - 100 requests per minute
  general: { limit: 100, windowSeconds: 60 },

  // Authentication - 10 attempts per 15 minutes
  auth: { limit: 10, windowSeconds: 900 },

  // Property creation - 20 per hour
  createProperty: { limit: 20, windowSeconds: 3600 },

  // Messaging - 60 messages per minute
  messaging: { limit: 60, windowSeconds: 60 },

  // Search - 120 requests per minute
  search: { limit: 120, windowSeconds: 60 },

  // AI features - 10 per minute
  ai: { limit: 10, windowSeconds: 60 },

  // File uploads - 30 per hour
  upload: { limit: 30, windowSeconds: 3600 },

  // Strict - for sensitive operations - 5 per minute
  strict: { limit: 5, windowSeconds: 60 },
} as const;

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}

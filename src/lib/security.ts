/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize search input to prevent injection attacks
 * Removes or escapes special characters that could be used for injection
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return "";

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Limit length to prevent DoS
  sanitized = sanitized.slice(0, 200);

  // Remove or escape potentially dangerous characters for SQL/LIKE queries
  // Note: Supabase's query builder handles escaping, but we add extra protection
  sanitized = sanitized
    .replace(/[<>'"`;\\]/g, "") // Remove dangerous chars
    .replace(/%/g, "\\%") // Escape SQL LIKE wildcards
    .replace(/_/g, "\\_")
    .trim();

  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  // Basic email regex - not perfect but catches most invalid emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Also check length
  if (email.length > 254) return false;

  return emailRegex.test(email);
}

/**
 * Validate phone number (Mexican format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is often optional

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\+\.]/g, "");

  // Mexican phones: 10 digits, or with country code 52 = 12 digits
  return /^(\d{10}|52\d{10})$/.test(cleaned);
}

/**
 * Sanitize HTML to prevent XSS
 * For use when displaying user-generated content
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate and sanitize property slug
 */
export function sanitizeSlug(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with dash
    .replace(/-+/g, "-") // Replace multiple dashes with single
    .replace(/^-|-$/g, "") // Remove leading/trailing dashes
    .slice(0, 100); // Limit length
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
  if (!id || typeof id !== "string") return false;

  // UUID v4 regex (also matches cuid which Prisma uses)
  const uuidRegex = /^[a-zA-Z0-9_-]{10,36}$/;
  return uuidRegex.test(id);
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Sanitize message content
 */
export function sanitizeMessage(input: string): string {
  if (!input) return "";

  // Remove null bytes and limit length
  let sanitized = input.replace(/\0/g, "").slice(0, 5000);

  // Remove potentially dangerous HTML/script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  return sanitized.trim();
}

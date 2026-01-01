/**
 * Environment variable validation
 * This file validates required environment variables at runtime
 */

type EnvConfig = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  DATABASE_URL?: string;

  // Mapbox
  NEXT_PUBLIC_MAPBOX_TOKEN?: string;

  // External Services
  TINYPNG_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;

  // Site Config
  NEXT_PUBLIC_SITE_URL?: string;
};

function getEnvVar(key: string, required: boolean = false): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please check your .env file or environment configuration.`
    );
  }

  return value || "";
}

export function validateEnv(): EnvConfig {
  // Required variables - will throw if missing
  const config: EnvConfig = {
    NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", true),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", true),
  };

  // Optional variables
  config.DATABASE_URL = getEnvVar("DATABASE_URL");
  config.NEXT_PUBLIC_MAPBOX_TOKEN = getEnvVar("NEXT_PUBLIC_MAPBOX_TOKEN");
  config.TINYPNG_API_KEY = getEnvVar("TINYPNG_API_KEY");
  config.ANTHROPIC_API_KEY = getEnvVar("ANTHROPIC_API_KEY");
  config.NEXT_PUBLIC_SITE_URL = getEnvVar("NEXT_PUBLIC_SITE_URL");

  return config;
}

// Helper to check if a service is configured
export function isServiceConfigured(service: "mapbox" | "tinypng" | "anthropic"): boolean {
  switch (service) {
    case "mapbox":
      return !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    case "tinypng":
      return !!process.env.TINYPNG_API_KEY;
    case "anthropic":
      return !!process.env.ANTHROPIC_API_KEY;
    default:
      return false;
  }
}

// Validate on module load in development
if (process.env.NODE_ENV === "development") {
  try {
    validateEnv();
  } catch (error) {
    console.warn("Environment validation warning:", error);
  }
}

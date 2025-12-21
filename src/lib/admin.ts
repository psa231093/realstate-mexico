import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface AdminCheckResult {
  isAdmin: boolean;
  userId: string | null;
  error?: NextResponse;
}

/**
 * Check if the current user is an admin.
 * Use this in API routes to protect admin-only endpoints.
 *
 * @example
 * const { isAdmin, userId, error } = await requireAdmin();
 * if (!isAdmin) return error;
 */
export async function requireAdmin(): Promise<AdminCheckResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAdmin: false,
      userId: null,
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      isAdmin: false,
      userId: user.id,
      error: NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      ),
    };
  }

  if (profile.role !== "ADMIN") {
    return {
      isAdmin: false,
      userId: user.id,
      error: NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
    };
  }

  return {
    isAdmin: true,
    userId: user.id,
  };
}

/**
 * Client-side hook helper to check admin status.
 * Returns the profile with role for use in components.
 */
export async function checkAdminClient(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never, userId: string) {
  const { data: profile } = await supabase
    .from("Profile")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "ADMIN";
}

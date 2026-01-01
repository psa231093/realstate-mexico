import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Check admin access
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const supabase = await createClient();

    // Get date for "this week" queries
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    // Run all queries in parallel
    const [
      totalPropertiesResult,
      activePropertiesResult,
      inactivePropertiesResult,
      featuredPropertiesResult,
      newPropertiesResult,
      totalUsersResult,
      adminUsersResult,
      agentUsersResult,
      newUsersResult,
      pendingInquiriesResult,
      totalInquiriesResult,
    ] = await Promise.all([
      // Total properties
      supabase
        .from("Property")
        .select("*", { count: "exact", head: true }),
      // Active properties
      supabase
        .from("Property")
        .select("*", { count: "exact", head: true })
        .eq("active", true),
      // Inactive properties
      supabase
        .from("Property")
        .select("*", { count: "exact", head: true })
        .eq("active", false),
      // Featured properties
      supabase
        .from("Property")
        .select("*", { count: "exact", head: true })
        .eq("featured", true),
      // New properties this week
      supabase
        .from("Property")
        .select("*", { count: "exact", head: true })
        .gte("createdAt", oneWeekAgoISO),
      // Total users
      supabase
        .from("Profile")
        .select("*", { count: "exact", head: true }),
      // Admin users
      supabase
        .from("Profile")
        .select("*", { count: "exact", head: true })
        .eq("role", "ADMIN"),
      // Agent users
      supabase
        .from("Profile")
        .select("*", { count: "exact", head: true })
        .eq("role", "AGENT"),
      // New users this week
      supabase
        .from("Profile")
        .select("*", { count: "exact", head: true })
        .gte("createdAt", oneWeekAgoISO),
      // Pending inquiries (NUEVO status)
      supabase
        .from("Inquiry")
        .select("*", { count: "exact", head: true })
        .eq("status", "NUEVO"),
      // Total inquiries
      supabase
        .from("Inquiry")
        .select("*", { count: "exact", head: true }),
    ]);

    const stats = {
      properties: {
        total: totalPropertiesResult.count || 0,
        active: activePropertiesResult.count || 0,
        inactive: inactivePropertiesResult.count || 0,
        featured: featuredPropertiesResult.count || 0,
        newThisWeek: newPropertiesResult.count || 0,
      },
      users: {
        total: totalUsersResult.count || 0,
        admins: adminUsersResult.count || 0,
        agents: agentUsersResult.count || 0,
        regular: (totalUsersResult.count || 0) - (adminUsersResult.count || 0) - (agentUsersResult.count || 0),
        newThisWeek: newUsersResult.count || 0,
      },
      inquiries: {
        total: totalInquiriesResult.count || 0,
        pending: pendingInquiriesResult.count || 0,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

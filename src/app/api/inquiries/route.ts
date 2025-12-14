import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/inquiries - Get user's inquiries (sent or received)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "received"; // received or sent
    const status = searchParams.get("status"); // NUEVO, CONTACTADO, CERRADO

    if (type === "received") {
      // Get user's property IDs first
      const { data: properties } = await supabase
        .from("Property")
        .select("id")
        .eq("ownerId", user.id);

      const propertyIds = properties?.map((p) => p.id) || [];

      if (propertyIds.length === 0) {
        return NextResponse.json([]);
      }

      // Get inquiries for user's properties
      let query = supabase
        .from("Inquiry")
        .select(`
          id,
          name,
          email,
          phone,
          message,
          status,
          createdAt,
          Property:propertyId (
            id,
            slug,
            title,
            mainImageUrl
          )
        `)
        .in("propertyId", propertyIds)
        .order("createdAt", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data: inquiries, error } = await query;

      if (error) {
        console.error("Error fetching received inquiries:", error);
        return NextResponse.json(
          { error: "Failed to fetch inquiries" },
          { status: 500 }
        );
      }

      return NextResponse.json(inquiries || []);
    } else {
      // Get inquiries sent by user
      let query = supabase
        .from("Inquiry")
        .select(`
          id,
          name,
          email,
          phone,
          message,
          status,
          createdAt,
          Property:propertyId (
            id,
            slug,
            title,
            mainImageUrl,
            Profile:ownerId (
              name,
              email,
              phone
            )
          )
        `)
        .eq("senderId", user.id)
        .order("createdAt", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data: inquiries, error } = await query;

      if (error) {
        console.error("Error fetching sent inquiries:", error);
        return NextResponse.json(
          { error: "Failed to fetch inquiries" },
          { status: 500 }
        );
      }

      return NextResponse.json(inquiries || []);
    }
  } catch (error) {
    console.error("Error in inquiries GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: inquiry, error } = await supabase
      .from("Inquiry")
      .insert({
        propertyId,
        name,
        email,
        phone: phone || null,
        message,
        senderId: user?.id || null,
        status: "NUEVO",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating inquiry:", error);
      return NextResponse.json(
        { error: "Failed to create inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error in inquiries POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

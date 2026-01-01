import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIP, RATE_LIMITS, rateLimitHeaders } from "@/lib/rate-limit";

// GET /api/conversations - Get user's conversations
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

    // Get conversations where user is either buyer or seller
    const { data: conversations, error } = await supabase
      .from("Conversation")
      .select(`
        id,
        lastMessageAt,
        lastMessageText,
        createdAt,
        propertyId,
        buyerId,
        sellerId,
        Property:propertyId (
          id,
          slug,
          title,
          mainImageUrl
        ),
        Buyer:buyerId (
          id,
          name,
          email,
          avatarUrl
        ),
        Seller:sellerId (
          id,
          name,
          email,
          avatarUrl
        )
      `)
      .or(`buyerId.eq.${user.id},sellerId.eq.${user.id}`)
      .order("lastMessageAt", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      (conversations || []).map(async (conv) => {
        const { count } = await supabase
          .from("Message")
          .select("*", { count: "exact", head: true })
          .eq("conversationId", conv.id)
          .neq("senderId", user.id)
          .is("readAt", null);

        return {
          ...conv,
          unreadCount: count || 0,
          // Determine the other participant
          otherParticipant: conv.buyerId === user.id ? conv.Seller : conv.Buyer,
          isBuyer: conv.buyerId === user.id,
        };
      })
    );

    return NextResponse.json(conversationsWithUnread);
  } catch (error) {
    console.error("Error in conversations GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 60 messages per minute
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`messaging:${clientIP}`, RATE_LIMITS.messaging);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, initialMessage } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Get property to find seller
    const { data: property, error: propertyError } = await supabase
      .from("Property")
      .select("id, ownerId, title")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Can't message yourself
    if (property.ownerId === user.id) {
      return NextResponse.json(
        { error: "Cannot start a conversation with yourself" },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("Conversation")
      .select("id")
      .eq("propertyId", propertyId)
      .eq("buyerId", user.id)
      .eq("sellerId", property.ownerId)
      .single();

    if (existingConv) {
      // If there's an initial message, add it
      if (initialMessage) {
        await supabase.from("Message").insert({
          conversationId: existingConv.id,
          senderId: user.id,
          content: initialMessage,
        });

        // Update conversation metadata
        await supabase
          .from("Conversation")
          .update({
            lastMessageAt: new Date().toISOString(),
            lastMessageText: initialMessage.substring(0, 100),
          })
          .eq("id", existingConv.id);
      }

      return NextResponse.json({ id: existingConv.id, existing: true });
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from("Conversation")
      .insert({
        propertyId,
        buyerId: user.id,
        sellerId: property.ownerId,
        lastMessageAt: initialMessage ? new Date().toISOString() : null,
        lastMessageText: initialMessage ? initialMessage.substring(0, 100) : null,
      })
      .select()
      .single();

    if (convError) {
      console.error("Error creating conversation:", convError);
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: 500 }
      );
    }

    // If there's an initial message, add it
    if (initialMessage) {
      await supabase.from("Message").insert({
        conversationId: conversation.id,
        senderId: user.id,
        content: initialMessage,
      });
    }

    return NextResponse.json({ id: conversation.id, existing: false }, { status: 201 });
  } catch (error) {
    console.error("Error in conversations POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

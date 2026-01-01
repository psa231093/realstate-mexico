import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("Conversation")
      .select("id, buyerId, sellerId")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to view this conversation" },
        { status: 403 }
      );
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before"); // cursor for pagination

    // Fetch messages
    let query = supabase
      .from("Message")
      .select(`
        id,
        content,
        readAt,
        createdAt,
        senderId,
        Sender:senderId (
          id,
          name,
          email,
          avatarUrl
        )
      `)
      .eq("conversationId", conversationId)
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt("createdAt", before);
    }

    const { data: messages, error: msgError } = await query;

    if (msgError) {
      console.error("Error fetching messages:", msgError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Mark unread messages as read
    const unreadIds = messages
      ?.filter(m => m.senderId !== user.id && !m.readAt)
      .map(m => m.id) || [];

    if (unreadIds.length > 0) {
      await supabase
        .from("Message")
        .update({ readAt: new Date().toISOString() })
        .in("id", unreadIds);
    }

    // Return messages in chronological order (oldest first)
    return NextResponse.json((messages || []).reverse());
  } catch (error) {
    console.error("Error in messages GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("Conversation")
      .select("id, buyerId, sellerId")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to send messages in this conversation" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Create the message
    const { data: message, error: msgError } = await supabase
      .from("Message")
      .insert({
        conversationId,
        senderId: user.id,
        content: content.trim(),
      })
      .select(`
        id,
        content,
        readAt,
        createdAt,
        senderId,
        Sender:senderId (
          id,
          name,
          email,
          avatarUrl
        )
      `)
      .single();

    if (msgError) {
      console.error("Error creating message:", msgError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Update conversation metadata
    await supabase
      .from("Conversation")
      .update({
        lastMessageAt: new Date().toISOString(),
        lastMessageText: content.trim().substring(0, 100),
      })
      .eq("id", conversationId);

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error in messages POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

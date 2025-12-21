import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/conversations/[id] - Get single conversation details
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

    const { data: conversation, error } = await supabase
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
          mainImageUrl,
          price,
          state,
          municipality
        ),
        Buyer:buyerId (
          id,
          name,
          email,
          avatarUrl,
          phone
        ),
        Seller:sellerId (
          id,
          name,
          email,
          avatarUrl,
          phone
        )
      `)
      .eq("id", conversationId)
      .single();

    if (error || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify user is part of this conversation
    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to view this conversation" },
        { status: 403 }
      );
    }

    // Get unread count
    const { count } = await supabase
      .from("Message")
      .select("*", { count: "exact", head: true })
      .eq("conversationId", conversationId)
      .neq("senderId", user.id)
      .is("readAt", null);

    return NextResponse.json({
      ...conversation,
      unreadCount: count || 0,
      otherParticipant: conversation.buyerId === user.id ? conversation.Seller : conversation.Buyer,
      isBuyer: conversation.buyerId === user.id,
      currentUserId: user.id,
    });
  } catch (error) {
    console.error("Error in conversation GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Delete a conversation (optional)
export async function DELETE(
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
        { error: "Not authorized to delete this conversation" },
        { status: 403 }
      );
    }

    // Delete the conversation (messages will cascade)
    const { error } = await supabase
      .from("Conversation")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error);
      return NextResponse.json(
        { error: "Failed to delete conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in conversation DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationList, type Conversation } from "@/components/chat/ConversationList";
import { ChatView, type Message } from "@/components/chat/ChatView";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationDetails, setConversationDetails] = useState<(Conversation & { currentUserId: string }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      } else {
        setError("Error al cargar conversaciones");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Error de conexion");
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string, silent = false) => {
    if (!silent) setIsLoadingMessages(true);
    try {
      setError(null);
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        if (!silent) setError("Error al cargar mensajes");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (!silent) setError("Error de conexion");
    } finally {
      if (!silent) setIsLoadingMessages(false);
    }
  }, []);

  // Fetch conversation details
  const fetchConversationDetails = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setConversationDetails(data);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      fetchConversationDetails(selectedConversation.id);
    } else {
      setMessages([]);
      setConversationDetails(null);
    }
  }, [selectedConversation, fetchMessages, fetchConversationDetails]);

  // Setup Supabase Realtime subscription for messages
  useEffect(() => {
    if (!selectedConversation) {
      // Cleanup existing channel when no conversation selected
      if (channelRef.current) {
        supabaseRef.current.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const supabase = supabaseRef.current;

    // Create a channel for this conversation
    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${selectedConversation.id}`,
        },
        async (payload) => {
          // New message received - fetch full message with sender info
          const newMessage = payload.new as { id: string; senderId: string };

          // If the message is from someone else, fetch and add it
          if (conversationDetails && newMessage.senderId !== conversationDetails.currentUserId) {
            // Fetch the complete message with sender info
            await fetchMessages(selectedConversation.id, true);
            // Also update conversation list for unread counts
            fetchConversations();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${selectedConversation.id}`,
        },
        (payload) => {
          // Message updated (e.g., read status changed)
          const updatedMessage = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updatedMessage.id ? { ...m, readAt: updatedMessage.readAt } : m))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount or conversation change
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [selectedConversation, conversationDetails, fetchMessages, fetchConversations]);

  // Also subscribe to conversation updates for unread counts
  useEffect(() => {
    const supabase = supabaseRef.current;

    const conversationsChannel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Conversation",
        },
        () => {
          // Refresh conversations when any conversation is updated
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [fetchConversations]);

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // On mobile, switch to chat view
    if (window.innerWidth < 1024) {
      setActiveTab("chat");
    }
  };

  // Handle back button (mobile)
  const handleBack = () => {
    setSelectedConversation(null);
    setActiveTab("conversations");
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        // Update conversation list to show new message preview
        fetchConversations();
      } else if (res.status === 429) {
        setError("Demasiados mensajes. Espera un momento.");
      } else {
        setError("Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error de conexion");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] -m-4 lg:-m-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full border border-border rounded-lg overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 xl:w-96 border-r border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">Mensajes</h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} conversacion{conversations.length !== 1 ? "es" : ""}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id || null}
              onSelect={handleSelectConversation}
              isLoading={isLoadingConversations}
            />
          </div>
        </div>

        {/* Chat View */}
        <div className="flex-1 flex flex-col">
          <ChatView
            conversation={conversationDetails}
            messages={messages}
            isLoading={isLoadingMessages}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border px-4 pt-4">
            <h1 className="text-lg font-semibold text-foreground mb-3">Mensajes</h1>
            <TabsList className="w-full">
              <TabsTrigger value="conversations" className="flex-1">
                Conversaciones
                {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {conversations.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1" disabled={!selectedConversation}>
                Chat
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conversations" className="flex-1 overflow-hidden m-0">
            <div className="h-full overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation?.id || null}
                onSelect={handleSelectConversation}
                isLoading={isLoadingConversations}
              />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
            <ChatView
              conversation={conversationDetails}
              messages={messages}
              isLoading={isLoadingMessages}
              isSending={isSending}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

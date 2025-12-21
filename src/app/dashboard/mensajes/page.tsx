"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationList, type Conversation } from "@/components/chat/ConversationList";
import { ChatView, type Message } from "@/components/chat/ChatView";
import { cn } from "@/lib/utils";

// Poll interval for new messages (in milliseconds)
const POLL_INTERVAL = 5000;

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationDetails, setConversationDetails] = useState<(Conversation & { currentUserId: string }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("conversations");

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string, silent = false) => {
    if (!silent) setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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

  // Poll for new messages
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id, true);
      fetchConversations(); // Also refresh conversation list for unread counts
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedConversation, fetchMessages, fetchConversations]);

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
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] -m-4 lg:-m-6">
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

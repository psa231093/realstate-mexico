"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  ExternalLink,
  Phone,
  Mail,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import type { Conversation } from "./ConversationList";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface Message {
  id: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  senderId: string;
  Sender: Profile;
}

interface ConversationDetails extends Conversation {
  currentUserId: string;
  Property: Conversation["Property"] & {
    price?: number;
    state?: string;
    municipality?: string;
  };
}

interface ChatViewProps {
  conversation: ConversationDetails | null;
  messages: Message[];
  isLoading?: boolean;
  isSending?: boolean;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMessageDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];

  messages.forEach((message) => {
    const dateStr = new Date(message.createdAt).toDateString();
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && new Date(lastGroup.messages[0].createdAt).toDateString() === dateStr) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ date: dateStr, messages: [message] });
    }
  });

  return groups;
}

export function ChatView({
  conversation,
  messages,
  isLoading,
  isSending,
  onSendMessage,
  onBack,
}: ChatViewProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim() && !isSending) {
      onSendMessage(messageText.trim());
      setMessageText("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/30">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2">
          Selecciona una conversacion
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Elige una conversacion de la lista para ver los mensajes
        </p>
      </div>
    );
  }

  const participant = conversation.otherParticipant;
  const participantName = participant?.name || participant?.email || "Usuario";
  const participantInitial = participantName.charAt(0).toUpperCase();
  const currentUserId = conversation.currentUserId;
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={participant?.avatarUrl || undefined} />
            <AvatarFallback>{participantInitial}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {participantName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {conversation.isBuyer ? "Vendedor" : "Comprador interesado"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {participant?.email && (
              <Button variant="ghost" size="icon" asChild>
                <a href={`mailto:${participant.email}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Property info bar */}
        <Link
          href={`/propiedades/${conversation.Property.slug}`}
          className="flex items-center gap-3 px-4 py-2 bg-muted/50 hover:bg-muted transition-colors border-t border-border"
        >
          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
            <Image
              src={conversation.Property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100"}
              alt={conversation.Property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {conversation.Property.title}
            </p>
            {conversation.Property.state && (
              <p className="text-xs text-muted-foreground">
                {conversation.Property.municipality}, {conversation.Property.state}
              </p>
            )}
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("flex gap-2", i % 2 === 0 && "justify-end")}>
                {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                <Skeleton className={cn("h-16 rounded-2xl", i % 2 === 0 ? "w-48" : "w-56")} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">
              Inicia la conversacion enviando un mensaje
            </p>
          </div>
        ) : (
          messageGroups.map((group) => (
            <div key={group.date} className="space-y-3">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
                  {formatMessageDate(group.messages[0].createdAt)}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message, idx) => {
                const isOwn = message.senderId === currentUserId;
                const showAvatar = !isOwn && (idx === 0 || group.messages[idx - 1].senderId !== message.senderId);

                return (
                  <div
                    key={message.id}
                    className={cn("flex gap-2", isOwn && "justify-end")}
                  >
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.Sender?.avatarUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {(message.Sender?.name || message.Sender?.email || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[75%] px-4 py-2 rounded-2xl",
                        isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <div
                        className={cn(
                          "flex items-center gap-1 text-[10px] mt-1",
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}
                      >
                        <span>{formatMessageTime(message.createdAt)}</span>
                        {isOwn && (
                          message.readAt ? (
                            <CheckCheck className="h-3 w-3 text-blue-400" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border bg-card p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              rows={1}
              className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-h-32"
              style={{ minHeight: "44px" }}
            />
          </div>
          <Button
            size="icon"
            className="h-11 w-11 rounded-full flex-shrink-0"
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

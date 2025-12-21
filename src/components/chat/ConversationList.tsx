"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface Property {
  id: string;
  slug: string;
  title: string;
  mainImageUrl: string | null;
}

export interface Conversation {
  id: string;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  createdAt: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  Property: Property;
  Buyer: Profile;
  Seller: Profile;
  otherParticipant: Profile;
  unreadCount: number;
  isBuyer: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  isLoading?: boolean;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Ayer";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("es-MX", { weekday: "short" });
  } else {
    return date.toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    });
  }
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 p-3">
            <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-muted-foreground text-sm">
          No tienes conversaciones aun
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          Contacta a un vendedor para iniciar una conversacion
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        const isSelected = selectedId === conversation.id;
        const participant = conversation.otherParticipant;
        const participantName = participant?.name || participant?.email || "Usuario";
        const participantInitial = participantName.charAt(0).toUpperCase();

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              "w-full flex gap-3 p-4 text-left transition-colors hover:bg-muted/50",
              isSelected && "bg-primary/5 hover:bg-primary/10"
            )}
          >
            {/* Property thumbnail */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <Image
                src={conversation.Property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100"}
                alt={conversation.Property.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={participant?.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px]">
                      {participantInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "font-medium text-sm truncate",
                    conversation.unreadCount > 0 ? "text-foreground" : "text-foreground/80"
                  )}>
                    {participantName}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 min-w-[20px] px-1.5 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(conversation.lastMessageAt)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {conversation.Property.title}
              </p>

              {conversation.lastMessageText && (
                <p className={cn(
                  "text-sm truncate mt-1",
                  conversation.unreadCount > 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}>
                  {conversation.lastMessageText}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

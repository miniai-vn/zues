import { Message } from "@/hooks/data/useCS";

// Re-export Message type for convenience
export type { Message } from "@/hooks/data/useCS";

// User type for chat components
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

// Conversation type for chat components
export interface ChatConversation {
  id: number;
  name: string;
  avatar?: string;
  isGroup?: boolean;
  participantCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  messages: Message[];
}

// Message status types
export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

// Extended message type with additional UI props
export interface ChatMessage extends Message {
  status?: MessageStatus;
  isEdited?: boolean;
  replyTo?: number; // Message ID this is replying to
  reactions?: MessageReaction[];
}

// Message reaction type
export interface MessageReaction {
  emoji: string;
  users: string[]; // User IDs who reacted
  count: number;
}

// File attachment type
export interface MessageAttachment {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document" | "other";
  size: number;
  url: string;
  thumbnailUrl?: string;
}

// Extended message type with attachments
export interface RichMessage extends ChatMessage {
  attachments?: MessageAttachment[];
  mentions?: string[]; // User IDs mentioned in the message
}

// Chat input state
export interface ChatInputState {
  text: string;
  attachments: File[];
  replyingTo?: ChatMessage;
  isTyping: boolean;
}

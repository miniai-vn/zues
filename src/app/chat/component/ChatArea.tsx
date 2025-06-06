import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/data/mockChatData";
import { Message, useCS } from "@/hooks/data/useCS";
import { cn } from "@/lib/utils";
import { Info, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatAreaProps {
  conversationId?: number;
}

const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const [message, setMessage] = useState("");
  const { fullInfoConversationWithMessages } = useCS({ id: conversationId });
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "1";

  useEffect(() => {
    if (fullInfoConversationWithMessages) {
      setMessages(fullInfoConversationWithMessages.messages);
    }
  }, [fullInfoConversationWithMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUserId,
      content: message,
      createdAt: new Date().toISOString(),
      senderType: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Select a conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  fullInfoConversationWithMessages?.avatar ??
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                }
              />
              <AvatarFallback>
                {fullInfoConversationWithMessages?.avatar ??
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {fullInfoConversationWithMessages?.name}
              </h3>
              {/* <p className="text-sm text-muted-foreground">
                {conversation.isGroup
                  ? `${conversation.participants.length} members`
                  : "Active now"}
              </p> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowContactInfo(!showContactInfo)}
              className={cn(showContactInfo && "bg-accent")}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            console.log("Message:", msg);
            const sender = msg.senderId ? getUserById(msg.senderId) : undefined;
            const isOwnMessage = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage
                      src={
                        msg.sender?.avatar ??
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      }
                    />
                    <AvatarFallback>
                      {msg.sender?.avatar?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[70%] space-y-1",
                    isOwnMessage ? "items-end" : "items-start"
                  )}
                >
                  {!isOwnMessage && (
                    <p className="text-xs text-muted-foreground font-medium">
                      {msg.sender?.name}
                    </p>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMessageTime(new Date(msg.createdAt))}
                  </p>
                </div>

                {isOwnMessage && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={sender?.avatar} />
                    <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 bg-background">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Info Sidebar */}
      {/* <ContactInfoSidebar
        conversation={conversation}
        isOpen={showContactInfo}
        onClose={() => setShowContactInfo(false)}
      /> */}
    </div>
  );
};

export default ChatArea;

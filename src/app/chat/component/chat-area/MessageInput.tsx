import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onAttachFile?: () => void;
  onEmojiPicker?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  onAttachFile,
  onEmojiPicker,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      <div className="flex items-center gap-2">
        {/* Attachment button */}
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onAttachFile}
          title="Attach file"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
            disabled={disabled}
          />
          
          {/* Emoji button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onEmojiPicker}
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            title="Add emoji"
            disabled={disabled}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

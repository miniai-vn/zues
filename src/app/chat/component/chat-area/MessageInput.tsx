import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/useTranslations";
import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import MessageSuggestions from "./MessageSugestion";

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
  placeholder,
  onAttachFile,
  onEmojiPicker,
}: MessageInputProps) => {
  const { t } = useTranslations();
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const displayPlaceholder = placeholder || t("dashboard.chat.typeMessage");

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
    if (e.key === "/" || (e.key.startsWith("/") && e.key.length > 1)) {
      setShowSuggestions(true);
    }
    if (e.key === "Backspace") {
      // Nếu message không còn dấu / hoặc chỉ còn mỗi dấu / thì ẩn suggestions
      if (!message.includes("/") || message === "/") {
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    // Create a synthetic event to update the input
    const syntheticEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>;

    setMessage(syntheticEvent.target.value);
    setShowSuggestions(false);
    setSearchQuery("");
    // inputRef.current?.focus();
  };

  const handleSuggestionsClose = () => {
    setShowSuggestions(false);
    setSearchQuery("");
    // inputRef.current?.focus();
  };

  return (
    <div className="border-t relative p-4 bg-background w-full">
      {showSuggestions && (
        <MessageSuggestions
          onSelect={handleSuggestionSelect}
          onClose={handleSuggestionsClose}
          searchQuery={searchQuery}
        />
      )}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onAttachFile}
          title={t("dashboard.chat.attachFile")}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="flex-1 relative">
          <Input
            placeholder={displayPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-10"
            disabled={disabled}
          />

          {/* Emoji button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onEmojiPicker}
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            title={t("dashboard.chat.addEmoji")}
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
          title={t("dashboard.chat.sendMessage")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

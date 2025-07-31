import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuotedMessage } from "@/hooks/data/cs/useCsStore";
import { useTranslations } from "@/hooks/useTranslations";
import { Plus, Send, Smile, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import MessageQuote from "./MessageQuote";
import MessageSuggestions from "./MessageSugestion";
import { MessageInputTool } from "./MessageInputTool";

interface MessageInputProps {
  showQuotedMessage?: boolean;
  quotedMessage?: QuotedMessage;
  handleRemoveQuote?: () => void;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onAttachFile?: (files: FileList) => void;
  onEmojiPicker?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  disabled = false,
  onAttachFile,
  onEmojiPicker,
  showQuotedMessage = false,
  handleRemoveQuote,
  quotedMessage,
}: MessageInputProps) => {
  const { t } = useTranslations();
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Thêm state quản lý file ảnh

  // Hàm lấy preview url cho file ảnh
  const getFilePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Hàm xóa tất cả file ảnh
  const onRemoveAllFiles = () => {
    setImageFiles([]);
  };

  // Hàm xóa một file ảnh theo index
  const onRemoveFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Hàm xử lý khi bấm nút thêm ảnh
  const handleFileClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files) as File[];
      setImageFiles((prev) => [...prev, ...files]);
    };
    input.click();
  };

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
    <div className="border-t relative py-2 px-4 bg-background w-full">
      {showSuggestions && (
        <MessageSuggestions
          onSelect={handleSuggestionSelect}
          onClose={handleSuggestionsClose}
          searchQuery={searchQuery}
        />
      )}

      <MessageInputTool
        onSendMessage={onSendMessage}
        onUploadImages={(imageFiles) => {
          setImageFiles((prev) => [...prev, ...imageFiles]);
        }}
        onFileSelect={onAttachFile}
        disabled={disabled}
        placeholder={t("dashboard.chat.typeMessage")}
      />

      {showQuotedMessage && (
        <div className="mb-2">
          <MessageQuote
            quotedMessage={quotedMessage}
            onRemoveQuote={handleRemoveQuote}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder={t("dashboard.chat.typeMessage")}
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

        {imageFiles.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {imageFiles.length} ảnh
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-blue-600 h-auto p-0"
                onClick={onRemoveAllFiles}
              >
                Xóa tất cả
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imageFiles.map((file, index) => (
                <div
                  key={file.name + index}
                  className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200"
                >
                  <Image
                    src={getFilePreviewUrl(file) || "/placeholder.svg"}
                    alt={file.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() => onRemoveFile && onRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {/* Add more images button */}
              <Button
                type="button"
                variant="outline"
                className="w-24 h-24 flex-shrink-0 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 bg-transparent"
                onClick={handleFileClick}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

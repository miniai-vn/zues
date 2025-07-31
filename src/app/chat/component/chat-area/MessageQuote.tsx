"use client";

import { Button } from "@/components/ui/button";
import { QuotedMessage } from "@/hooks/data/cs/useCsStore";
import { X } from "lucide-react";

interface MessageQuoteProps {
  quotedMessage?: QuotedMessage;
  onRemoveQuote?: () => void;
  onSendMessage?: (message: string) => void;
  onQuoteClick?: (messageId: string) => void; // Add this new prop
}

export default function MessageQuote({
  quotedMessage,
  onRemoveQuote,
  onQuoteClick,
}: MessageQuoteProps) {
  return (
    <div className="w-full  max-w-full mx-auto bg-white border rounded-lg overflow-hidden">
      {/* Quoted Message Section */}
      {quotedMessage && (
        <div
          onClick={() => onQuoteClick?.(quotedMessage.id)}
          className="w-full bg-gray-50 border-l-4 border-blue-500 p-3 relative hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <span className="text-blue-500">💬</span>
                <span className="font-medium">
                  Trả lời {quotedMessage.authorId || "người dùng"}
                </span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-2">
                {quotedMessage.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={onRemoveQuote}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

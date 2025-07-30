"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import useTemplates from "@/hooks/useTemplates";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageSuggestionsProps {
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  searchQuery: string;
}

export default function MessageSuggestions({
  onSelect,
  onClose,
  searchQuery,
}: MessageSuggestionsProps) {
  const { templates = [], isLoadingTemplates } = useTemplates({
    queryParams: {
      search: searchQuery,
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < templates.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : templates.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (templates[selectedIndex]) {
            const s = templates[selectedIndex];
            onSelect(s.content);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, templates, onSelect, onClose]);

  if (isLoadingTemplates) {
    return (
      <Card className="absolute bottom-full left-0 right-0 mb-2 p-4 shadow-lg border">
        <div className="text-center text-gray-500">Đang tải...</div>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="absolute bottom-full left-0 right-0 mb-2 p-4 shadow-lg border">
        <div className="text-center text-gray-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Không tìm thấy mẫu phù hợp cho &quot;{searchQuery}&quot;</p>
          <p className="text-sm mt-1">Thử từ khóa khác</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 shadow-lg border max-h-80 overflow-y-auto">
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Message Suggestions
          </span>
          <Badge variant="secondary" className="text-xs">
            {templates.length}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </p>
      </div>

      <div ref={containerRef} className="max-h-64 overflow-y-auto">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`p-3 cursor-pointer transition-colors border-b last:border-b-0 ${
              index === selectedIndex
                ? "bg-blue-50 border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSelect(template.content)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {"/" + template.code}
                  </Badge>
                </div>
                <p className="font-medium text-sm text-gray-900 mb-1">
                  {template.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

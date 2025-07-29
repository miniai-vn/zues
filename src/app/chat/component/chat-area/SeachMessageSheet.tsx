"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { useMessage } from "@/hooks/data/cs/useMessage";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MessageTimestamp } from "./MessageTimestamp";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function SearchMessageSheet() {
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400); // debounce 400ms
  const [isOpen, setIsOpen] = useState(false);
  const { selectedConversationId, setSelectedMessageId } = useCsStore();
  const [page, setPage] = useState(1);
  const { paginatedMessage } = useMessage({
    queryParams: {
      search: debouncedSearch,
      conversationId: selectedConversationId as number,
      page,
      limit: 4,
    },
  });

  const [messages, setMessages] = useState(paginatedMessage?.data || []);
  useEffect(() => {
    if (!paginatedMessage) return;
    if (page === 1) {
      setMessages(paginatedMessage.data);
    } else if (page > 1) {
      setMessages((prev) => [...prev, ...paginatedMessage.data]);
    }
  }, [paginatedMessage]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost">
          <Search className="w-4 h-4 mr-2" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-medium">
              Tìm kiếm trong trò chuyện
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 border-b">
            <div className="flex gap-2 text-sm">
              <span className="text-muted-foreground">Lọc theo:</span>
              <Select defaultValue="sender">
                <SelectTrigger className="w-auto h-6 text-xs border-0 p-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sender">👤 Người gửi</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="date">
                <SelectTrigger className="w-auto h-6 text-xs border-0 p-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">📅 Ngày gửi</SelectItem>
                  <SelectItem value="recent">Gần đây</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3">
              <h3 className="font-medium text-sm mb-3">Tin nhắn</h3>
              <div className="space-y-3 h-[58vh] max-h-[58vh] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    onClick={() => {
                      setSelectedMessageId(message.id as number);
                    }}
                    key={message.id}
                    className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={message.sentBy.avatar || defaultAvatar}
                      />
                      <AvatarFallback
                        className={
                          message.initials === "HM"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }
                      >
                        {message.sentBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {message.sentBy.name}
                        </p>
                        <MessageTimestamp timestamp={message.createdAt} />
                        {/* <span className="text-xs text-muted-foreground">
                          {message.createdAt}
                        </span> */}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-3 text-muted-foreground"
                disabled={!paginatedMessage?.hasNext}
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                Xem thêm
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

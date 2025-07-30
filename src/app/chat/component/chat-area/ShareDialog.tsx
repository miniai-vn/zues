"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactList } from "./ContactList";
import { Checkbox } from "@/components/ui/checkbox";
import { useCustomer } from "@/hooks/data/cs/useCustomer";
import { useCsStore } from "@/hooks/data/cs/useCsStore";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [shareMessage, setShareMessage] = useState("để đi lòe nga");
  const { selectedConversation } = useCsStore();
  const { customers } = useCustomer({
    queryParams: {
      channelId: selectedConversation?.channel.id,
      search: searchQuery,
    },
  });

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Thêm hàm chọn tất cả
  const handleSelectAll = () => {
    if (customers?.every((c) => selectedContacts.includes(c.id))) {
      // Nếu đã chọn hết thì bỏ chọn hết
      setSelectedContacts((prev) =>
        prev.filter((id) => !customers.some((c) => c.id === id))
      );
    } else {
      // Chọn tất cả contact đang hiển thị
      setSelectedContacts((prev) => [
        ...prev,
        ...customers.map((c) => c.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Kiểm tra đã chọn hết chưa
  const isAllSelected =
    customers?.length > 0 &&
    customers?.every((c) => selectedContacts.includes(c.id));

  const handleShare = () => {
    console.log("Sharing message to:", selectedContacts);
    console.log("Share message:", shareMessage);
    onClose();
    setSelectedContacts([]);
    setShareMessage("");
  };

  const handleClose = () => {
    onClose();
    setSelectedContacts([]);
    setShareMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-medium">Chia sẻ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent" className="text-sm">
                Gần đây
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-sm">
                Nhóm trò chuyện
              </TabsTrigger>
              <TabsTrigger value="friends" className="text-sm">
                Bạn bè
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4">
              {/* Select All Checkbox */}
              <div className="flex items-center mb-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="ml-2 text-sm cursor-pointer select-none"
                >
                  Chọn tất cả
                </label>
              </div>
              <ContactList
                contacts={customers}
                selectedContacts={selectedContacts}
                onContactSelect={handleContactSelect}
              />
            </TabsContent>

            <TabsContent value="groups" className="mt-4">
              {/* Select All Checkbox */}
              <div className="flex items-center mb-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="ml-2 text-sm cursor-pointer select-none"
                >
                  Chọn tất cả
                </label>
              </div>
              <ContactList
                contacts={customers?.filter((c) => c.type === "group")}
                selectedContacts={selectedContacts}
                onContactSelect={handleContactSelect}
              />
            </TabsContent>

            <TabsContent value="friends" className="mt-4">
              {/* Select All Checkbox */}
              <div className="flex items-center mb-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="select-all"
                  className="ml-2 text-sm cursor-pointer select-none"
                >
                  Chọn tất cả
                </label>
              </div>
              <ContactList
                contacts={customers?.filter((c) => c.type === "friend")}
                selectedContacts={selectedContacts}
                onContactSelect={handleContactSelect}
              />
            </TabsContent>
          </Tabs>
          <div className="border-t pt-4">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                onClick={handleShare}
                disabled={selectedContacts.length === 0}
              >
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

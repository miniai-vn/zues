import { useEffect, useState } from "react";
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
import { Customer, useCustomer } from "@/hooks/data/cs/useCustomer";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface ShareDialogProps {
  messageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  handleForward?: (customerIds: string[]) => void; // Optional prop for forward action
}

export function ShareDialog({
  isOpen,
  onClose,
  handleForward,
}: ShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500); // debounce 500ms

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { selectedConversation } = useCsStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { customerReponse } = useCustomer({
    queryParams: {
      channelId: selectedConversation?.channel.id,
      search: debouncedSearchQuery,
      page,
      limit: 20,
    },
  });

  const [displayContacts, setDisplayContacts] = useState<Customer[]>([]);

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Thêm hàm chọn tất cả
  const handleSelectAll = () => {
    if (displayContacts.every((c) => selectedContacts.includes(c.id))) {
      // Nếu đã chọn hết thì bỏ chọn hết
      setSelectedContacts((prev) =>
        prev.filter((id) => !customerReponse?.data.some((c) => c.id === id))
      );
    } else {
      // Chọn tất cả contact đang hiển thị
      setSelectedContacts((prev) => [
        ...prev,
        ...displayContacts.map((c) => c.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Kiểm tra đã chọn hết chưa
  const isAllSelected =
    displayContacts.length > 0 &&
    displayContacts.every((c) => selectedContacts.includes(c.id));

  const handleShare = () => {
    // Gọi hàm chia sẻ ở đây nếu cần
    handleForward?.(selectedContacts);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedContacts([]);
  };

  const handleLoadMore = () => {
    if (customerReponse?.data && page !== 1) {
      const newData = displayContacts.concat(customerReponse.data);
      const newContacts = newData.filter(
        (contact, index, self) =>
          index === self.findIndex((c) => c.id === contact.id)
      );
      setDisplayContacts(newContacts);
    }

    if (customerReponse?.hasNext && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page === 1) {
      setDisplayContacts(customerReponse?.data || []);
    }
    if (customerReponse && customerReponse.hasNext) {
      setHasMore(customerReponse.hasNext);
    }
  }, [customerReponse]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

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
                contacts={displayContacts}
                selectedContacts={selectedContacts}
                onContactSelect={handleContactSelect}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
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

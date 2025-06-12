import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useUsersWithCs } from "@/hooks/data/cs/useUser";
import { User } from "@/hooks/data/useAuth";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: number;
  onAddParticipants: (participantIds: string[]) => void;
  existingParticipantIds?: string[];
}

const AddParticipantDialog = ({
  open,
  onOpenChange,
  onAddParticipants,
  existingParticipantIds = [],
}: AddParticipantDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { users, isFetchingUsersWithCs } = useUsersWithCs({
    search: debouncedSearch,
  });
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (open) {
      setSelectedParticipants(existingParticipantIds);
    }
  }, [open, existingParticipantIds]);

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleConfirm = () => {
    const newlySelected = selectedParticipants.filter(
      (id) => !existingParticipantIds.includes(id)
    );
    onAddParticipants(newlySelected);
    setSelectedParticipants([]);
    setSearchQuery("");
    setDebouncedSearch("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedParticipants([]);
    setSearchQuery("");
    setDebouncedSearch("");
    onOpenChange(false);
  };

  // Helper function to check if user is already in conversation
  const isUserInConversation = (userId: string) => {
    return existingParticipantIds.includes(userId);
  };

  // Helper function to check if checkbox should be checked
  const isUserSelected = (userId: string) => {
    return selectedParticipants.includes(userId);
  };

  const newlySelectedCount = selectedParticipants.filter(
    (id) => !existingParticipantIds.includes(id)
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Thêm thành viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Loading State */}
          {isFetchingUsersWithCs && (
            <div className="flex justify-center py-4">
              <div className="text-sm text-muted-foreground">
                Đang tải danh sách người dùng...
              </div>
            </div>
          )}

          {/* Participants List */}
          {!isFetchingUsersWithCs && (
            <div className="flex-1 overflow-y-auto max-h-[40vh] space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Tất cả người dùng ({users.length})
                </h4>
                <div className="space-y-2">
                  {users.map((user: User) => {
                    const isInConversation = isUserInConversation(user.id);
                    const isSelected = isUserSelected(user.id);

                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleParticipantToggle(user.id)
                          }
                          disabled={isInConversation}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name?.charAt(0) ||
                              user.username?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              {user.name || user.username}
                            </p>
                            {isInConversation && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Đã tham gia
                              </span>
                            )}
                          </div>
                          {user.email && (
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                          {user.roles && user.roles.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {user.roles.map((role) => role.name).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isFetchingUsersWithCs && users.length === 0 && (
                <div className="flex justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "Không tìm thấy người dùng nào"
                      : "Không có người dùng nào"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={newlySelectedCount === 0}>
              Xác nhận ({newlySelectedCount})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddParticipantDialog;

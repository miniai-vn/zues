import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUsersWithCs } from "@/hooks/data/cs/useUser";
import { User } from "@/hooks/data/useAuth";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useChannels from "@/hooks/data/useChannels";
import { useQueryClient } from "@tanstack/react-query";
import useTranslations from "@/hooks/useTranslations";
interface IAddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: number;
}

const AddUserDialog = ({
  open,
  onOpenChange,
  channelId,
}: IAddUserDialogProps) => {
  const { t } = useTranslations();
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const debouncedInputValue = useDebouncedValue(inputValue, 300);
  const queryClient = useQueryClient();

  const { addUsersToChannel, removeUsersFromChannel, channelDetail } =
    useChannels({
      id: channelId,
    });

  const existingUserIds = useMemo(() => {
    return channelDetail?.users.map((user) => user.id) || [];
  }, [channelDetail?.users]);

  const { users, isFetchingUsersWithCs } = useUsersWithCs({
    search: debouncedInputValue,
  });

  useEffect(() => {
    if (open) {
      setSelectedUsers(existingUserIds);
      setInputValue("");
    }
  }, [open, existingUserIds]);

  const handleConfirm = async () => {
    const newlySelectedUsers = selectedUsers.filter(
      (userId) => !existingUserIds.includes(userId),
    );

    await addUsersToChannel({
      channelId: channelId,
      userIds: newlySelectedUsers,
    });

    setSelectedUsers([]);
    setInputValue("");
    onOpenChange(false);
  };

  const handleRemoveUser = async () => {
    const removedCount = existingUserIds.filter(
      (id) => !selectedUsers.includes(id),
    );

    await removeUsersFromChannel({
      channelId: channelId,
      userIds: removedCount,
    });

    setSelectedUsers([]);
    setInputValue("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedUsers([]);
    setInputValue("");
    onOpenChange(false);
  };

  const isUserSelected = (userId: string) => selectedUsers.includes(userId);
  const isUserInChannel = (userId: string) => existingUserIds.includes(userId);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const newlySelectedCount = selectedUsers.filter(
    (id) => !existingUserIds.includes(id),
  ).length;

  const removedCount = existingUserIds.filter(
    (id) => !selectedUsers.includes(id),
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t("dashboard.channels.modal.addUserToChannel")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.channels.modal.searchPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Loading State */}
          {isFetchingUsersWithCs && (
            <div className="flex justify-center py-4">
              <div className="text-sm text-muted-foreground">
                {t("dashboard.channels.modal.loadingUsers")}
              </div>
            </div>
          )}

          {/* Participants List */}
          {!isFetchingUsersWithCs && (
            <div className="flex-1 overflow-y-auto max-h-[40vh] space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {t("dashboard.channels.modal.allUsers")} ({users.length})
                </h4>
                <div className="space-y-2">
                  {users.map((user: User) => {
                    const isInChannel = isUserInChannel(user.id);
                    const isSelected = isUserSelected(user.id);

                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleUserToggle(user.id)}
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
                            {isInChannel && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {t("dashboard.channels.modal.added")}
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
                    {debouncedInputValue.trim() !== "" &&
                      t("dashboard.channels.modal.noUsersFound")}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              {t("dashboard.channels.modal.buttonCancel")}
            </Button>
            {removedCount > 0 ? (
              <Button variant="destructive" onClick={handleRemoveUser}>
                {t("dashboard.channels.modal.buttonRemoveUser")} ({removedCount}
                )
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                disabled={newlySelectedCount === 0}
              >
                {t("dashboard.channels.modal.buttonConfirm")} (
                {newlySelectedCount})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;

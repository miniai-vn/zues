import React, { useState } from "react";
import { Search, X, Plus, User, Crown, Shield } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Conversation, mockUsers } from "@/data/mockChatData";
import { cn } from "@/lib/utils";

interface ParticipantManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock available users to add
const availableUsers = [
  { id: "10", name: "Dương Châu", avatar: "/placeholder.svg", isOnline: true },
  {
    id: "11",
    name: "Phương Dung",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  { id: "12", name: "Bảo Bèo", avatar: "/placeholder.svg", isOnline: true },
  {
    id: "13",
    name: "Hoàng Anh Vũ",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "14",
    name: "Thuê Xe Máy Đà Lạt",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
];

const ParticipantManagementSheet = ({
  open,
  onOpenChange,
}: ParticipantManagementSheetProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const currentUserId = "1";

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddParticipants = () => {
    console.log("Adding participants:", selectedUsers);
    setSelectedUsers([]);
    onOpenChange(false);
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserRole = (userId: string) => {
    if (userId === currentUserId) return "owner";
    if (userId === "2") return "admin";
    return "member";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case "admin":
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Quản lý thành viên</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Current Members */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              {/* Thành viên hiện tại ({conversation.participants.length}) */}
            </h4>
            <div className="space-y-2">
              {mockUsers.map((participant) => {
                const user = mockUsers.find((u) => u.id === participant.id);
                const role = getUserRole(participant.id);

                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{user?.name}</p>
                          {getRoleIcon(role)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {participant.status === "online"
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={role === "owner" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {role === "owner"
                          ? "Chủ nhóm"
                          : role === "admin"
                          ? "Quản trị"
                          : "Thành viên"}
                      </Badge>
                      {participant.id !== currentUserId && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Add New Members */}
          <div>
            <h4 className="text-sm font-medium mb-3">Thêm thành viên mới</h4>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Available Users */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent",
                    selectedUsers.includes(user.id) &&
                      "bg-accent border-primary"
                  )}
                  onClick={() => handleUserToggle(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            {selectedUsers.length > 0 && (
              <div className="mt-4">
                <Button onClick={handleAddParticipants} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm {selectedUsers.length} thành viên
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ParticipantManagementSheet;

"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users } from "lucide-react";
import { Agent } from "@/hooks/data/useAgents";
import { useUsers } from "@/hooks/useUser";
import useAgents from "@/hooks/data/useAgents";

interface UserAssignDialogProps {
  agent: Agent;
  onUserUpdate: () => void;
}

const UserAssignDialog: React.FC<UserAssignDialogProps> = ({
  agent,
  onUserUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Use real users data from the useUsers hook
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers({
    initialPageSize: 50, // Get more users for selection
    enabled: open, // Only fetch when dialog is open
  });

  const { addUsersToAgent } = useAgents();
  const users = usersResponse?.data || [];

  // Initialize selected users based on agent's current users
  useEffect(() => {
    if (agent.users) {
      // Convert number ids to string ids for consistency with User type
      setSelectedUserIds(agent.users.map((user) => user.id.toString()));
    }
  }, [agent.users]);

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Call the API to assign users to agent
      await addUsersToAgent({
        userIds: selectedUserIds,
        agentId: agent.id,
      });

      toast({
        title: "Users Updated",
        description: `Agent "${agent.name}" has been assigned to ${selectedUserIds.length} user(s).`,
      });
      setOpen(false);
      onUserUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user assignments.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Users ({agent.users?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Users to {agent.name}</DialogTitle>
          <DialogDescription>
            Select the users who can use this agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 border rounded"
                >
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {user.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {user.email} •{" "}
                      {user.role || user.roles?.[0]?.name || "User"}
                    </p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-4">
                  No users available
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAssignDialog;

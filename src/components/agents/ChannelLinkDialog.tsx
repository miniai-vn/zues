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
import { Loader2, Link } from "lucide-react";
import useChannels from "@/hooks/data/useChannels";
import useAgents, { Agent } from "@/hooks/data/useAgents";

interface ChannelLinkDialogProps {
  agent: Agent;
  onChannelUpdate: () => void;
}

const ChannelLinkDialog: React.FC<ChannelLinkDialogProps> = ({
  agent,
  onChannelUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { channels, isLoadingChannels } = useChannels();
  const { addChannelToAgent } = useAgents();

  // Initialize selected channels based on agent's current channels
  useEffect(() => {
    if (agent.channels) {
      setSelectedChannelIds(agent.channels.map((channel) => channel.id));
    }
  }, [agent.channels]);

  const handleChannelToggle = (channelId: number) => {
    setSelectedChannelIds((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Send all selected channel IDs to the addChannelToAgent function
      // The backend will handle adding/removing channels as needed
      await addChannelToAgent({
        channelIds: selectedChannelIds,
        agentId: agent.id,
      });

      toast({
        title: "Channels Updated",
        description: `Agent "${agent.name}" has been linked to ${selectedChannelIds.length} channel(s).`,
      });
      setOpen(false);
      onChannelUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update channel links.",
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
          <Link className="h-4 w-4" />
          Channels ({agent.channels?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Link Channels to {agent.name}</DialogTitle>
          <DialogDescription>
            Select the channels you want to link to this agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingChannels ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading channels...</span>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {channels?.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center space-x-3 p-2 border rounded"
                >
                  <Checkbox
                    id={`channel-${channel.id}`}
                    checked={selectedChannelIds.includes(channel.id)}
                    onCheckedChange={() => handleChannelToggle(channel.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`channel-${channel.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {channel.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {channel.type} •{" "}
                      {channel.department?.name || "No Department"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      channel.status === "active" ? "default" : "secondary"
                    }
                  >
                    {channel.status}
                  </Badge>
                </div>
              )) || (
                <p className="text-center text-muted-foreground py-4">
                  No channels available
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

export default ChannelLinkDialog;

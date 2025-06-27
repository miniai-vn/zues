"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
import { Bot, Loader2, Link, Users } from "lucide-react";
import { Agent, AgentStatus } from "@/hooks/data/useAgents";
import ChannelLinkDialog from "./ChannelLinkDialog";
import UserAssignDialog from "./UserAssignDialog";

interface AgentCardProps {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onView: (agent: Agent) => void;
  onChannelUpdate: () => void;
  onUserUpdate: () => void;
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onView,
  onChannelUpdate,
  onUserUpdate,
  isDeleting,
  isActivating,
  isDeactivating,
}) => {
  const { t } = useTranslations();

  const getStatusBadgeClass = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ACTIVE:
        return "bg-green-100 text-green-700";
      case AgentStatus.TRAINING:
        return "bg-yellow-100 text-yellow-700";
      case AgentStatus.MAINTENANCE:
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderActionButton = () => {
    if (agent.status === AgentStatus.ACTIVE) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeactivate(agent.id)}
          disabled={isDeactivating}
          className="text-orange-600 hover:text-orange-700"
        >
          {isDeactivating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Deactivate"
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onActivate(agent.id)}
        disabled={isActivating}
        className="text-green-600 hover:text-green-700"
      >
        {isActivating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Activate"
        )}
      </Button>
    );
  };

  return (
    <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3
                className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onView(agent)}
              >
                {agent.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span>Model: {agent.modelName}</span>
                  <span>Provider: {agent.modelProvider}</span>
                  <span>
                    Created: {new Date(agent.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {agent.channels && agent.channels.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Link className="h-3 w-3" />
                      {agent.channels.length} channel
                      {agent.channels.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {agent.users && agent.users.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      {agent.users.length} user
                      {agent.users.length > 1 ? "s" : ""}
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                      agent.status
                    )}`}
                  >
                    {agent.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChannelLinkDialog
              agent={agent}
              onChannelUpdate={onChannelUpdate}
            />
            <UserAssignDialog agent={agent} onUserUpdate={onUserUpdate} />
            <Button variant="outline" size="sm" onClick={() => onView(agent)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
              Edit
            </Button>
            {renderActionButton()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(agent.id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;

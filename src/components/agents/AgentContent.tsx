"use client";
import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Bot, Loader2 } from "lucide-react";
import { Agent } from "@/hooks/data/useAgents";
import AgentList from "./AgentList";
import CreateAgentButton from "./CreateAgentButton";

interface AgentContentProps {
  agents: Agent[];
  isLoading: boolean;
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onView: (agent: Agent) => void;
  onChannelUpdate: () => void;
  onCreateAgent: () => void;
  onUserUpdate: () => void;
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
}

const AgentContent: React.FC<AgentContentProps> = ({
  agents,
  isLoading,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onView,
  onChannelUpdate,
  onCreateAgent,
  onUserUpdate,
  isDeleting,
  isActivating,
  isDeactivating,
}) => {
  const { t } = useTranslations();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
        <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
        <span className="text-lg text-muted-foreground">Loading agents...</span>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
        <Bot className="w-16 h-16 text-gray-400" />
        <span className="text-lg text-muted-foreground">
          {t("dashboard.agents.emptyState.title")}
        </span>
        <CreateAgentButton onClick={onCreateAgent} />
      </div>
    );
  }

  return (
    <AgentList
      agents={agents}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
      onActivate={onActivate}
      onDeactivate={onDeactivate}
      onChannelUpdate={onChannelUpdate}
      onUserUpdate={onUserUpdate}
      isDeleting={isDeleting}
      isActivating={isActivating}
      isDeactivating={isDeactivating}
    />
  );
};

export default AgentContent;

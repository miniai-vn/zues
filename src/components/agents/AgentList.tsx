"use client";
import React from "react";
import { Agent } from "@/hooks/data/useAgents";
import AgentCard from "./AgentCard";

interface AgentListProps {
  agents: Agent[];
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

const AgentList: React.FC<AgentListProps> = ({
  agents,
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
  return (
    <div className="grid gap-4">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onView={onView}
          onChannelUpdate={onChannelUpdate}
          onUserUpdate={onUserUpdate}
          isDeleting={isDeleting}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      ))}
    </div>
  );
};

export default AgentList;

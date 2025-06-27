import { Agent } from "@/hooks/data/useAgents";

// Types for Agent management components
export interface AgentActionHandlers {
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onView: (agent: Agent) => void;
  onChannelUpdate: () => void;
  onUserUpdate: () => void;
  onCreateAgent: () => void;
}

export interface AgentActionStates {
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
}

export interface SearchBarHandlers {
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreateAgent: () => void;
}

export interface PaginationHandlers {
  onPageChange: (page: number) => void;
}

// Re-export Agent type for convenience
export type { Agent } from "@/hooks/data/useAgents";

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Bot, Plus, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useAgents, { Agent, AgentStatus } from "@/hooks/data/useAgents";

// Agent Card Component
const AgentCard = ({
  agent,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onView,
  isDeleting,
  isActivating,
  isDeactivating,
}: {
  agent: Agent;
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onView: (agent: Agent) => void;
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
}) => {
  const { t } = useTranslations();

  return (
    <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3
                className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onView(agent)}
              >
                {agent.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Model: {agent.modelName}</span>
                <span>Provider: {agent.modelProvider}</span>
                <span>
                  Created: {new Date(agent.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    agent.status === AgentStatus.ACTIVE
                      ? "bg-green-100 text-green-700"
                      : agent.status === AgentStatus.TRAINING
                      ? "bg-yellow-100 text-yellow-700"
                      : agent.status === AgentStatus.MAINTENANCE
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(agent)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(agent)}>
              Edit
            </Button>
            {agent.status === AgentStatus.ACTIVE ? (
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
            ) : (
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
            )}
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

// Agent List Component
const AgentList = ({
  agents,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onView,
  isDeleting,
  isActivating,
  isDeactivating,
}: {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onView: (agent: Agent) => void;
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
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
          isDeleting={isDeleting}
          isActivating={isActivating}
          isDeactivating={isDeactivating}
        />
      ))}
    </div>
  );
};

// Create Agent Button Component
const CreateAgentButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslations();

  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      {t("dashboard.agents.createAgent")}
    </Button>
  );
};

// Main Component
const AgentManagementPage = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebouncedValue(search, 500);

  const {
    agents,
    agentsResponse,
    isLoadingAgents,
    deleteAgent,
    activateAgent,
    deactivateAgent,
    isDeletingAgent,
    isActivatingAgent,
    isDeactivatingAgent,
    refetchAgents,
  } = useAgents({
    page,
    limit,
    search: debouncedSearch,
  });

  console.log("Agents:", agents);

  const handleCreateAgent = () => {
    router.push("/dashboard/agents/create");
  };

  const handleEditAgent = (agent: Agent) => {
    router.push(`/dashboard/agents/${agent.id}/edit`);
  };

  const handleViewAgent = (agent: Agent) => {
    router.push(`/dashboard/agents/${agent.id}`);
  };

  const handleDeleteAgent = (id: number) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      deleteAgent(id);
    }
  };

  const handleActivateAgent = (id: number) => {
    activateAgent(id);
  };

  const handleDeactivateAgent = (id: number) => {
    deactivateAgent(id);
  };

  const handleRefresh = () => {
    refetchAgents();
  };

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t("dashboard.agents.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.agents.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          {/* Search and Actions */}
          <div className="flex justify-between gap-4 items-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dashboard.agents.searchPlaceholder")}
              className="mr-4 w-full flex-1"
            />
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoadingAgents}
              className="flex items-center gap-2"
            >
              {isLoadingAgents ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {t("dashboard.agents.search")}
            </Button>
            <CreateAgentButton onClick={handleCreateAgent} />
          </div>

          {/* Agent List */}
          <div className="flex-1 min-h-0 overflow-auto">
            {isLoadingAgents ? (
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
                <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
                <span className="text-lg text-muted-foreground">
                  Loading agents...
                </span>
              </div>
            ) : agents.length === 0 ? (
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
                <Bot className="w-16 h-16 text-gray-400" />
                <span className="text-lg text-muted-foreground">
                  {t("dashboard.agents.emptyState.title")}
                </span>
                <CreateAgentButton onClick={handleCreateAgent} />
              </div>
            ) : (
              <AgentList
                agents={agents}
                onEdit={handleEditAgent}
                onView={handleViewAgent}
                onDelete={handleDeleteAgent}
                onActivate={handleActivateAgent}
                onDeactivate={handleDeactivateAgent}
                isDeleting={isDeletingAgent}
                isActivating={isActivatingAgent}
                isDeactivating={isDeactivatingAgent}
              />
            )}
          </div>

          {/* Pagination */}
          {agentsResponse && agentsResponse.totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, agentsResponse.total)} of{" "}
                {agentsResponse.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, agentsResponse.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= agentsResponse.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentManagementPage;

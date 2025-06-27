"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import useAgents, { Agent } from "@/hooks/data/useAgents";
import {
  AgentSearchBar,
  AgentContent,
  AgentPagination,
} from "@/components/agents";

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

  const handleChannelUpdate = () => {
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
          <AgentSearchBar
            search={search}
            onSearchChange={setSearch}
            onRefresh={handleRefresh}
            onCreateAgent={handleCreateAgent}
            isLoading={isLoadingAgents}
          />

          {/* Agent Content */}
          <div className="flex-1 min-h-0 overflow-auto">
            <AgentContent
              agents={agents}
              isLoading={isLoadingAgents}
              onEdit={handleEditAgent}
              onView={handleViewAgent}
              onDelete={handleDeleteAgent}
              onActivate={handleActivateAgent}
              onDeactivate={handleDeactivateAgent}
              onChannelUpdate={handleChannelUpdate}
              onCreateAgent={handleCreateAgent}
              isDeleting={isDeletingAgent}
              isActivating={isActivatingAgent}
              isDeactivating={isDeactivatingAgent}
            />
          </div>

          {/* Pagination */}
          {agentsResponse && agentsResponse.totalPages > 1 && (
            <AgentPagination
              currentPage={page}
              totalPages={agentsResponse.totalPages}
              totalItems={agentsResponse.total}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentManagementPage;

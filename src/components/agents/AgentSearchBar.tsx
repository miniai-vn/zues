"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/useTranslations";
import { Search, Loader2 } from "lucide-react";
import CreateAgentButton from "./CreateAgentButton";

interface AgentSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreateAgent: () => void;
  isLoading?: boolean;
}

const AgentSearchBar: React.FC<AgentSearchBarProps> = ({
  search,
  onSearchChange,
  onRefresh,
  onCreateAgent,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex justify-between gap-4 items-center">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("dashboard.agents.searchPlaceholder")}
        className="mr-4 w-full flex-1"
      />
      <Button
        onClick={onRefresh}
        variant="outline"
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        {t("dashboard.agents.search")}
      </Button>
      <CreateAgentButton onClick={onCreateAgent} />
    </div>
  );
};

export default AgentSearchBar;

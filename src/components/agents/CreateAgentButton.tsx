"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { Plus } from "lucide-react";

interface CreateAgentButtonProps {
  onClick: () => void;
}

const CreateAgentButton: React.FC<CreateAgentButtonProps> = ({ onClick }) => {
  const { t } = useTranslations();

  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      {t("dashboard.agents.createAgent")}
    </Button>
  );
};

export default CreateAgentButton;

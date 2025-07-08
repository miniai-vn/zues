import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

interface Agent {
  updatedAt: string;
  shop?: {
    name: string;
  };
}

interface AgentHeaderProps {
  isEditMode: boolean;
  existingAgent?: Agent;
  isCreatingAgent: boolean;
  isUpdatingAgent: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export const AgentHeader = ({
  isEditMode,
  existingAgent,
  isCreatingAgent,
  isUpdatingAgent,
  onBack,
  onSubmit,
}: AgentHeaderProps) => {
  const { t } = useTranslations();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("dashboard.agents.form.back")}
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditMode
            ? t("dashboard.agents.form.edit")
            : t("dashboard.agents.form.create")}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {isEditMode && existingAgent
            ? t("dashboard.agents.form.lastUpdated", {
                date: new Date(existingAgent.updatedAt).toLocaleString(),
              })
            : t("dashboard.agents.form.created", {
                date: new Date().toLocaleString(),
              })}
        </span>
        {isEditMode && existingAgent?.shop && (
          <span className="text-sm px-2 py-1 bg-blue-100 rounded-md">
            {existingAgent.shop.name}
          </span>
        )}
        <Button
          onClick={onSubmit}
          disabled={isCreatingAgent || isUpdatingAgent}
          className="flex items-center gap-2"
        >
          {isCreatingAgent || isUpdatingAgent ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEditMode
            ? t("dashboard.agents.form.update")
            : t("dashboard.agents.form.create")}
        </Button>
      </div>
    </div>
  );
};

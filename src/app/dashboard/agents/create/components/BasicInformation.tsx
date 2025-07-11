import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentStatus, CreateAgentDto } from "@/hooks/data/useAgents";
import { useTranslations } from "@/hooks/useTranslations";

interface BasicInformationProps {
  formData: CreateAgentDto;
  errors: Record<string, string>;
  onInputChange: (field: keyof CreateAgentDto, value: string | AgentStatus) => void;
}

export const BasicInformation = ({ formData, errors, onInputChange }: BasicInformationProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-4">
      {/* Agent Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {t("dashboard.agents.form.fields.name.label")} *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          placeholder={t("dashboard.agents.form.fields.name.placeholder")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t("dashboard.agents.form.fields.description.label")}
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder={t("dashboard.agents.form.fields.description.placeholder")}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">
          {t("dashboard.agents.form.fields.status.label")}
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onInputChange("status", value as AgentStatus)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("dashboard.agents.form.fields.status.placeholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AgentStatus.ACTIVE}>
              {t("dashboard.agents.form.fields.status.active")}
            </SelectItem>
            <SelectItem value={AgentStatus.INACTIVE}>
              {t("dashboard.agents.form.fields.status.inactive")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

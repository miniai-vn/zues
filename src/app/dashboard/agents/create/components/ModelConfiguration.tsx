import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MultiSelect } from "@/components/ui/multi-select";
import { HelpCircle, Loader2 } from "lucide-react";
import { ModelProvider, CreateAgentDto } from "@/hooks/data/useAgents";
import { useTranslations } from "@/hooks/useTranslations";
import { LLMParameters, LLMParametersSection } from "./LLMParameters";
import { Department } from "@/hooks/data/useDepartments";

interface ModelConfigurationProps {
  formData: CreateAgentDto;
  errors: Record<string, string>;
  llmParams: LLMParameters;
  outputLanguage: string;
  selectedDepartmentIds: string[];
  departments: Department[];
  isFetchingDepartments: boolean;
  validModels: Partial<Record<ModelProvider, string[]>>;
  onInputChange: (field: keyof CreateAgentDto, value: string | ModelProvider) => void;
  onModelProviderChange: (provider: ModelProvider) => void;
  onLLMParamsChange: (updates: Partial<LLMParameters>) => void;
  onOutputLanguageChange: (language: string) => void;
  onDepartmentChange: (departmentIds: string[]) => void;
}

export const ModelConfiguration = ({
  formData,
  errors,
  llmParams,
  outputLanguage,
  selectedDepartmentIds,
  departments,
  isFetchingDepartments,
  validModels,
  onInputChange,
  onModelProviderChange,
  onLLMParamsChange,
  onOutputLanguageChange,
  onDepartmentChange,
}: ModelConfigurationProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-6">
      {/* Model Provider */}
      <div className="space-y-2">
        <Label htmlFor="provider">
          {t("dashboard.agents.form.fields.modelProvider.label")} *
        </Label>
        <Select
          value={formData.modelProvider}
          onValueChange={(value) => onModelProviderChange(value as ModelProvider)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t("dashboard.agents.form.fields.modelProvider.placeholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ModelProvider.GOOGLE}>Google</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model">
          {t("dashboard.agents.form.fields.model.label")} *
        </Label>
        {formData.modelProvider === ModelProvider.LOCAL ? (
          <Input
            id="model"
            value={formData.modelName}
            onChange={(e) => onInputChange("modelName", e.target.value)}
            placeholder={t("dashboard.agents.form.fields.model.localPlaceholder")}
            className={errors.modelName ? "border-red-500" : ""}
          />
        ) : (
          <Select
            value={formData.modelName}
            onValueChange={(value) => onInputChange("modelName", value)}
          >
            <SelectTrigger className={errors.modelName ? "border-red-500" : ""}>
              <SelectValue
                placeholder={t("dashboard.agents.form.fields.model.placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {validModels[formData.modelProvider]?.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.modelName && (
          <p className="text-sm text-red-500">{errors.modelName}</p>
        )}
      </div>

      {/* Department Selection */}
      <div className="space-y-2">
        <Label htmlFor="departments">
          {t("dashboard.agents.form.fields.departments.label")}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.agents.form.fields.departments.description")}
        </p>
        {isFetchingDepartments || !departments ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              {t("dashboard.agents.form.fields.departments.loading")}
            </span>
          </div>
        ) : (
          <MultiSelect
            options={[
              {
                label: t("dashboard.agents.form.fields.departments.none"),
                value: "none",
              },
              ...(departments?.map((department) => ({
                label: `${department.name} ${
                  department.syncStatus === true
                    ? t("dashboard.agents.form.fields.departments.synced")
                    : t("dashboard.agents.form.fields.departments.syncing")
                }`,
                value: department.id!,
              })) || []),
            ]}
            selected={selectedDepartmentIds}
            onChange={onDepartmentChange}
            placeholder={t("dashboard.agents.form.fields.departments.placeholder")}
            searchPlaceholder={t("dashboard.agents.form.fields.departments.placeholder")}
            emptyText={t("dashboard.agents.form.fields.departments.none")}
          />
        )}
      </div>

      {/* Agent Prompt */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="prompt">
            {t("dashboard.agents.form.fields.prompt.label")} *
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md p-4 text-sm">
                <p className="font-medium mb-2">
                  {t("dashboard.agents.form.fields.prompt.tooltip.title")}
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>[BẮT BUỘC] VAI TRÒ:</strong>{" "}
                    {t("dashboard.agents.form.fields.prompt.tooltip.role")}
                  </p>
                  <p>
                    <strong>[BẮT BUỘC] MỤC TIÊU CHÍNH:</strong>{" "}
                    {t("dashboard.agents.form.fields.prompt.tooltip.goal")}
                  </p>
                  <p>
                    <strong>[TÙY CHỌN] CHẾ ĐỘ LÀM VIỆC:</strong>{" "}
                    {t("dashboard.agents.form.fields.prompt.tooltip.workingMode")}
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Chế độ 1:</strong>{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.mode1")}
                    </li>
                    <li>
                      <strong>Chế độ 2:</strong>{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.mode2")}
                    </li>
                    <li>
                      <strong>Chế độ 3:</strong>{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.mode3")}
                    </li>
                  </ul>
                  <p>
                    <strong>
                      {t("dashboard.agents.form.fields.prompt.tooltip.variables")}
                    </strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <code>{"{history}"}</code>:{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.history")}
                    </li>
                    <li>
                      <code>{"{context}"}</code>:{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.context")}
                    </li>
                    <li>
                      <code>{"{question}"}</code>:{" "}
                      {t("dashboard.agents.form.fields.prompt.tooltip.question")}
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.agents.form.fields.prompt.description")}
        </p>
        <Textarea
          id="prompt"
          value={formData.prompt}
          onChange={(e) => onInputChange("prompt", e.target.value)}
          rows={12}
          placeholder={t("dashboard.agents.form.fields.prompt.placeholder")}
          className={`resize-none whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border ${
            errors.prompt ? "border-red-500" : ""
          }`}
        />
        {errors.prompt && (
          <p className="text-sm text-red-500">{errors.prompt}</p>
        )}
      </div>

      {/* Output Language Preferences */}
      <div className="space-y-2">
        <Label htmlFor="language">
          {t("dashboard.agents.form.fields.outputLanguage.label")}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.agents.form.fields.outputLanguage.description")}
        </p>
        <Select value={outputLanguage} onValueChange={onOutputLanguageChange}>
          <SelectTrigger>
            <SelectValue
              placeholder={t("dashboard.agents.form.fields.outputLanguage.placeholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">
              {t("dashboard.agents.form.fields.outputLanguage.auto")}
            </SelectItem>
            <SelectItem value="en">
              {t("dashboard.agents.form.fields.outputLanguage.en")}
            </SelectItem>
            <SelectItem value="zh">
              {t("dashboard.agents.form.fields.outputLanguage.zh")}
            </SelectItem>
            <SelectItem value="vi">
              {t("dashboard.agents.form.fields.outputLanguage.vi")}
            </SelectItem>
            <SelectItem value="ja">
              {t("dashboard.agents.form.fields.outputLanguage.ja")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LLM Parameters */}
      <LLMParametersSection
        parameters={llmParams}
        onParameterChange={onLLMParamsChange}
      />
    </div>
  );
};

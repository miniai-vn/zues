import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "@/hooks/useTranslations";

export interface LLMParameters {
  temperature: number;
  topP: number;
  maxTokens: number;
  topK: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string;
}

interface LLMParametersProps {
  parameters: LLMParameters;
  onParameterChange: (updates: Partial<LLMParameters>) => void;
}

export const LLMParametersSection = ({ parameters, onParameterChange }: LLMParametersProps) => {
  const { t } = useTranslations();

  const handleSliderChange = (field: keyof LLMParameters, value: number[]) => {
    onParameterChange({ [field]: value[0] });
  };

  const handleInputChange = (field: keyof LLMParameters, value: string) => {
    onParameterChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">
          {t("dashboard.agents.form.fields.parameters.label")}
        </Label>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.agents.form.fields.parameters.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.temperature.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.temperature}
            </span>
          </div>
          <Slider
            value={[parameters.temperature]}
            onValueChange={(value) => handleSliderChange("temperature", value)}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.temperature.description")}
          </p>
        </div>

        {/* Top P */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.topP.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.topP}
            </span>
          </div>
          <Slider
            value={[parameters.topP]}
            onValueChange={(value) => handleSliderChange("topP", value)}
            max={1}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.topP.description")}
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.maxTokens.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.maxTokens}
            </span>
          </div>
          <Slider
            value={[parameters.maxTokens]}
            onValueChange={(value) => handleSliderChange("maxTokens", value)}
            max={4000}
            min={50}
            step={50}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.maxTokens.description")}
          </p>
        </div>

        {/* Top K */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.topK.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.topK}
            </span>
          </div>
          <Slider
            value={[parameters.topK]}
            onValueChange={(value) => handleSliderChange("topK", value)}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.topK.description")}
          </p>
        </div>

        {/* Frequency Penalty */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.frequencyPenalty.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.frequencyPenalty}
            </span>
          </div>
          <Slider
            value={[parameters.frequencyPenalty]}
            onValueChange={(value) => handleSliderChange("frequencyPenalty", value)}
            max={2}
            min={-2}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.frequencyPenalty.description")}
          </p>
        </div>

        {/* Presence Penalty */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {t("dashboard.agents.form.fields.parameters.presencePenalty.label")}
            </Label>
            <span className="text-sm text-muted-foreground">
              {parameters.presencePenalty}
            </span>
          </div>
          <Slider
            value={[parameters.presencePenalty]}
            onValueChange={(value) => handleSliderChange("presencePenalty", value)}
            max={2}
            min={-2}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.agents.form.fields.parameters.presencePenalty.description")}
          </p>
        </div>
      </div>

      {/* Stop Sequences */}
      <div className="space-y-2">
        <Label>
          {t("dashboard.agents.form.fields.parameters.stopSequences.label")}
        </Label>
        <Input
          value={parameters.stopSequences}
          onChange={(e) => handleInputChange("stopSequences", e.target.value)}
          placeholder={t("dashboard.agents.form.fields.parameters.stopSequences.placeholder")}
        />
        <p className="text-xs text-muted-foreground">
          {t("dashboard.agents.form.fields.parameters.stopSequences.description")}
        </p>
      </div>
    </div>
  );
};

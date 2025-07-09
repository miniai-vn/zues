"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

// Import our refactored components
import { AgentHeader } from "./components/AgentHeader";
import { BasicInformation } from "./components/BasicInformation";
import { ModelConfiguration } from "./components/ModelConfiguration";
import { PreviewPanel } from "./components/PreviewPanel";
import { useAgentForm } from "./hooks/useAgentForm";

const AgentConfigurationUI = () => {
  const { t } = useTranslations();
  const {
    // State
    formData,
    outputLanguage,
    selectedDepartmentIds,
    llmParams,
    errors,
    messages,
    newMessage,

    // Computed
    isEditMode,
    existingAgent,
    isLoadingAgent,
    loadingError,
    isCreatingAgent,
    isUpdatingAgent,
    departments,
    isFetchingDepartments,
    validModels,

    // Handlers
    handleInputChange,
    handleModelProviderChange,
    handleLLMParamsChange,
    setOutputLanguage,
    setSelectedDepartmentIds,
    setNewMessage,
    handleSendMessage,
    handleSubmit,
    handleBack,
  } = useAgentForm();

  if (isEditMode && isLoadingAgent) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>{t("dashboard.agents.form.errors.loading")}</p>
        </div>
      </div>
    );
  }

  if (isEditMode && loadingError) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Bot className="w-16 h-16 text-gray-400" />
          <h2 className="text-xl font-semibold">
            {t("dashboard.agents.form.errors.notFound")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.agents.form.errors.notFoundDescription")}
          </p>
          <Button onClick={handleBack}>
            {t("dashboard.agents.form.back")}
          </Button>
        </div>
      </div>
    );
  }

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
        <CardContent className="flex flex-1 min-h-0 p-0">
          <div className="flex flex-1">
            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Configuration Panel */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  {/* Header */}
                  <AgentHeader
                    isEditMode={isEditMode}
                    existingAgent={existingAgent}
                    isCreatingAgent={isCreatingAgent}
                    isUpdatingAgent={isUpdatingAgent}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                  />

                  {/* Basic Information */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("dashboard.agents.form.basicInformation")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BasicInformation
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                      />
                    </CardContent>
                  </Card>

                  {/* AI Settings */}
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {t("dashboard.agents.form.aiSettings")}
                        </CardTitle>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ModelConfiguration
                        formData={formData}
                        errors={errors}
                        llmParams={llmParams}
                        outputLanguage={outputLanguage}
                        selectedDepartmentIds={selectedDepartmentIds}
                        departments={departments || []}
                        isFetchingDepartments={isFetchingDepartments}
                        validModels={validModels}
                        onInputChange={handleInputChange}
                        onModelProviderChange={handleModelProviderChange}
                        onLLMParamsChange={handleLLMParamsChange}
                        onOutputLanguageChange={setOutputLanguage}
                        onDepartmentChange={setSelectedDepartmentIds}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Preview Panel */}
              <Card className="w-96 border-l rounded-none border-t-0 border-r-0 border-b-0">
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("dashboard.agents.form.previewAndDebugging")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 p-0">
                  <PreviewPanel
                    messages={messages}
                    newMessage={newMessage}
                    onMessageChange={setNewMessage}
                    onSendMessage={handleSendMessage}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfigurationUI;

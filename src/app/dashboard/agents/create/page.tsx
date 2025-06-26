"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/hooks/useTranslations";
import useAgents, {
  ModelProvider,
  AgentStatus,
  CreateAgentDto,
} from "@/hooks/data/useAgents";
import {
  Bot,
  ChevronDown,
  Save,
  Send,
  User,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const AgentConfigurationUI = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  // Check if we're in edit mode
  const agentId = params?.id ? parseInt(params.id as string) : null;
  const isEditMode = Boolean(agentId);

  // Form state
  const [formData, setFormData] = useState<CreateAgentDto>({
    name: "",
    modelProvider: ModelProvider.DEEPSEEK,
    modelName: "DeepSeek-V3",
    prompt: `# Vai trò: Trợ lý tạo trang AI

## Hồ sơ
- ngôn ngữ: Đa ngôn ngữ (phù hợp với ngôn ngữ của người dùng)
- mô tả: Trợ lý truy vấn cơ sở tri thức chuyên nghiệp, tập trung vào việc trích xuất thông tin từ cơ sở tri thức được chỉ định và cung cấp câu trả lời chính xác
- bối cảnh: Hệ thống AI chuyên dụng được phát triển bởi doanh nghiệp, được đào tạo chuyên biệt về nội dung cơ sở tri thức
- tính cách: Nghiêm túc, chuyên nghiệp, thân thiện nhưng không quá nhiệt tình`,
    description: "",
    status: AgentStatus.INACTIVE,
  });

  const [outputLanguage, setOutputLanguage] = useState("auto");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use hooks
  const {
    createAgent,
    updateAgent,
    isCreatingAgent,
    isUpdatingAgent,
    useAgent,
    useAvailableModels,
  } = useAgents();

  // Get agent data if in edit mode
  const { data: existingAgent, isLoading: isLoadingAgent } = useAgent(
    agentId || 0
  );

  // Get available models for the selected provider
  const { data: availableModels, isLoading: isLoadingModels } =
    useAvailableModels(formData.modelProvider);

  // Load existing agent data when in edit mode
  useEffect(() => {
    if (isEditMode && existingAgent) {
      setFormData({
        name: existingAgent.name,
        modelProvider: existingAgent.modelProvider,
        modelName: existingAgent.modelName,
        prompt: existingAgent.prompt,
        description: existingAgent.description || "",
        status: existingAgent.status,
        modelConfig: existingAgent.modelConfig,
      });
    }
  }, [isEditMode, existingAgent]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Agent name is required";
    }

    if (!formData.modelName.trim()) {
      newErrors.modelName = "Model name is required";
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = "Agent prompt is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && agentId) {
      updateAgent(
        { id: agentId, data: formData },
        {
          onSuccess: () => {
            router.push("/dashboard/agents");
          },
        }
      );
    } else {
      createAgent(formData, {
        onSuccess: () => {
          router.push("/dashboard/agents");
        },
      });
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateAgentDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle model provider change
  const handleModelProviderChange = (provider: ModelProvider) => {
    setFormData((prev) => ({
      ...prev,
      modelProvider: provider,
      modelName: "", // Reset model name when provider changes
    }));
  };

  // Chat preview state
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Xin lỗi, tôi chưa thể trả lời câu hỏi của bạn ngay bây giờ, nhóm của chúng tôi sẽ phản hồi tin nhắn của bạn sớm nhất có thể",
      time: "2025-06-26 13:53",
    },
    {
      type: "bot",
      content: "不好意思，您的问题我暂时无法解答，我们团队将尽快回复您的消息",
      time: "2025-06-26 13:53",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          type: "user",
          content: newMessage,
          time: new Date()
            .toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(/\//g, "-"),
        },
      ]);
      setNewMessage("");
    }
  };

  if (isEditMode && isLoadingAgent) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading agent...</p>
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/dashboard/agents")}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <h1 className="text-2xl font-semibold">
                        {isEditMode ? "Edit Agent" : "Create Agent"}
                      </h1>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">
                        {isEditMode && existingAgent
                          ? `Last updated: ${new Date(
                              existingAgent.updatedAt
                            ).toLocaleString()}`
                          : `Created: ${new Date().toLocaleString()}`}
                      </span>
                      <Button
                        onClick={handleSubmit}
                        disabled={isCreatingAgent || isUpdatingAgent}
                        className="flex items-center gap-2"
                      >
                        {isCreatingAgent || isUpdatingAgent ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isEditMode ? "Update" : "Create"}
                      </Button>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Agent Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Agent Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter agent name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="Enter agent description"
                        />
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleInputChange("status", value as AgentStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={AgentStatus.ACTIVE}>
                              Active
                            </SelectItem>
                            <SelectItem value={AgentStatus.INACTIVE}>
                              Inactive
                            </SelectItem>
                            <SelectItem value={AgentStatus.TRAINING}>
                              Training
                            </SelectItem>
                            <SelectItem value={AgentStatus.MAINTENANCE}>
                              Maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Settings */}
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">AI Settings</CardTitle>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Model Provider */}
                      <div className="space-y-2">
                        <Label htmlFor="provider">Model Provider *</Label>
                        <Select
                          value={formData.modelProvider}
                          onValueChange={(value) =>
                            handleModelProviderChange(value as ModelProvider)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ModelProvider.DEEPSEEK}>
                              DeepSeek
                            </SelectItem>
                            <SelectItem value={ModelProvider.OPENAI}>
                              OpenAI
                            </SelectItem>
                            <SelectItem value={ModelProvider.ANTHROPIC}>
                              Anthropic
                            </SelectItem>
                            <SelectItem value={ModelProvider.GOOGLE}>
                              Google
                            </SelectItem>
                            <SelectItem value={ModelProvider.LOCAL}>
                              Local
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        {isLoadingModels ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              Loading models...
                            </span>
                          </div>
                        ) : (
                          <Select
                            value={formData.modelName}
                            onValueChange={(value) =>
                              handleInputChange("modelName", value)
                            }
                          >
                            <SelectTrigger
                              className={
                                errors.modelName ? "border-red-500" : ""
                              }
                            >
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableModels?.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name}
                                </SelectItem>
                              )) || (
                                <>
                                  <SelectItem value="DeepSeek-V3">
                                    DeepSeek-V3
                                  </SelectItem>
                                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                                  <SelectItem value="Claude-3">
                                    Claude-3
                                  </SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                        {errors.modelName && (
                          <p className="text-sm text-red-500">
                            {errors.modelName}
                          </p>
                        )}
                      </div>

                      {/* Agent Prompt */}
                      <div className="space-y-2">
                        <Label htmlFor="prompt">Agent Prompt *</Label>
                        <p className="text-sm text-muted-foreground">
                          Used to set the agent's identity, skills, personality,
                          and response limitations
                        </p>
                        <Textarea
                          id="prompt"
                          value={formData.prompt}
                          onChange={(e) =>
                            handleInputChange("prompt", e.target.value)
                          }
                          rows={12}
                          placeholder="Enter agent prompt..."
                          className={`resize-none ${
                            errors.prompt ? "border-red-500" : ""
                          }`}
                        />
                        {errors.prompt && (
                          <p className="text-sm text-red-500">
                            {errors.prompt}
                          </p>
                        )}
                      </div>

                      {/* Output Language Preferences */}
                      <div className="space-y-2">
                        <Label htmlFor="language">
                          Output language preferences
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Language preferences for agent output, automatically
                          match according to user problems by default
                        </p>
                        <Select
                          value={outputLanguage}
                          onValueChange={setOutputLanguage}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto Match</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="vi">Vietnamese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Preview Panel */}
              <Card className="w-96 border-l rounded-none border-t-0 border-r-0 border-b-0">
                <CardHeader>
                  <CardTitle className="text-base">
                    Preview and debugging
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 p-0">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary">
                            {message.type === "bot" ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">
                            {message.time}
                          </div>
                          <Card className="p-3">
                            <p className="text-sm">{message.content}</p>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Message Input */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Please enter a message"
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-primary text-xs">
                          123
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        2025-06-26 13:53
                      </span>
                    </div>
                  </div>
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

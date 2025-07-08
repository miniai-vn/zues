import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import useAgents, { AgentStatus, CreateAgentDto, ModelProvider } from "@/hooks/data/useAgents";
import useDepartments from "@/hooks/data/useDepartments";
import { LLMParameters } from "../components/LLMParameters";

const DEFAULT_PROMPT = `[BẮT BUỘC] VAI TRÒ:
Bạn là một trợ lý AI chuyên nghiệp, [chèn chuyên môn cụ thể, ví dụ: chuyên gia phân tích tài chính, nhà văn sáng tạo, cố vấn pháp lý].
[BẮT BUỘC] MỤC TIÊU CHÍNH:
Nhiệm vụ của bạn là [chèn mục tiêu, ví dụ: trả lời câu hỏi, tóm tắt, phân tích, tạo nội dung mới] dựa trên các thông tin được cung cấp một cách chính xác, logic và hữu ích nhất cho người dùng.
[TÙY CHỌN] CHẾ ĐỘ LÀM VIỆC (Chọn một):
Chế độ 1 - Truy vấn Chính xác: Chỉ sử dụng thông tin từ Bối cảnh tài liệu. Tuyệt đối không suy diễn hoặc dùng kiến thức bên ngoài. Nếu thông tin không có, hãy trả lời: "Tôi không tìm thấy thông tin này trong tài liệu được cung cấp."
Chế độ 2 - Tổng hợp & Diễn giải: Sử dụng thông tin từ Bối cảnh tài liệu làm nguồn chính, nhưng có thể diễn giải, sắp xếp lại và tóm tắt bằng lời văn của bạn để dễ hiểu hơn. Không thêm thông tin mới không có trong tài liệu.
Chế độ 3 - Sáng tạo & Mở rộng: Sử dụng Bối cảnh tài liệu làm nền tảng hoặc nguồn cảm hứng. Được phép kết hợp với kiến thức chung của bạn để tạo ra nội dung mới, đề xuất ý tưởng, hoặc đưa ra các phân tích sâu hơn.
[TÙY CHỌN] ĐỊNH DẠNG ĐẦU RA:
Vui lòng trình bày câu trả lời dưới dạng [chèn định dạng, ví dụ: đoạn văn, gạch đầu dòng, bảng, email, JSON, bài đăng mạng xã hội]. Giọng văn cần [chèn giọng văn, ví dụ: chuyên nghiệp, thân thiện, học thuật, thuyết phục].
QUY TẮC CHUNG:
Luôn sử dụng Lịch sử trò chuyện để hiểu ngữ cảnh của các câu hỏi nối tiếp.
Luôn trả lời bằng ngôn ngữ của câu hỏi.
Trích dẫn nguồn (nếu có thể) khi sử dụng Chế độ 1 hoặc 2.
[NGUỒN THÔNG TIN]
Lịch sử trò chuyện:
{history}
Bối cảnh tài liệu:
{context}
[YÊU CẦU CỤ THỂ]
Câu hỏi:
{question}`;

const DEFAULT_LLM_PARAMS: LLMParameters = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 1000,
  topK: 40,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: "",
};

const VALID_MODELS: Partial<Record<ModelProvider, string[]>> = {
  [ModelProvider.GOOGLE]: [
    "gemini-pro",
    "gemini-pro-vision",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
  ],
};

interface Message {
  type: "bot" | "user";
  content: string;
  time: string;
}

const DEFAULT_MESSAGES: Message[] = [
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
];

export const useAgentForm = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  // Basic setup
  const agentId = params?.id ? parseInt(params.id as string) : null;
  const isEditMode = Boolean(agentId);

  // Form state
  const [formData, setFormData] = useState<CreateAgentDto>({
    name: "",
    modelProvider: ModelProvider.GOOGLE,
    modelName: "gemini-1.5-pro",
    prompt: DEFAULT_PROMPT,
    description: "",
    status: AgentStatus.INACTIVE,
  });

  const [outputLanguage, setOutputLanguage] = useState("auto");
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);
  const [llmParams, setLlmParams] = useState<LLMParameters>(DEFAULT_LLM_PARAMS);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Chat preview state
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [newMessage, setNewMessage] = useState("");

  // Hooks
  const { createAgent, updateAgent, isCreatingAgent, isUpdatingAgent, useAgent } = useAgents();
  const { departments, isFetchingDepartments } = useDepartments({});
  const { data: existingAgent, isLoading: isLoadingAgent, error: loadingError } = useAgent(agentId as number);

  // Load existing agent data
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

      // Set LLM parameters if they exist
      if (existingAgent.modelConfig) {
        setLlmParams({
          temperature: existingAgent.modelConfig.temperature || DEFAULT_LLM_PARAMS.temperature,
          topP: existingAgent.modelConfig.top_p || DEFAULT_LLM_PARAMS.topP,
          maxTokens: existingAgent.modelConfig.max_tokens || DEFAULT_LLM_PARAMS.maxTokens,
          topK: existingAgent.modelConfig.top_k || DEFAULT_LLM_PARAMS.topK,
          frequencyPenalty: existingAgent.modelConfig.frequency_penalty || DEFAULT_LLM_PARAMS.frequencyPenalty,
          presencePenalty: existingAgent.modelConfig.presence_penalty || DEFAULT_LLM_PARAMS.presencePenalty,
          stopSequences: existingAgent.modelConfig.stop_sequences?.join(", ") || DEFAULT_LLM_PARAMS.stopSequences,
        });
      }

      // Set departments if they exist
      if (existingAgent.shop?.id) {
        setSelectedDepartmentIds([existingAgent.shop.id.toString()]);
      } else {
        setSelectedDepartmentIds([]);
      }
    }
  }, [isEditMode, existingAgent, agentId]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("dashboard.agents.form.validation.nameRequired");
    }

    if (!formData.modelName.trim()) {
      newErrors.modelName = t("dashboard.agents.form.validation.modelRequired");
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = t("dashboard.agents.form.validation.promptRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (field: keyof CreateAgentDto, value: string | AgentStatus | ModelProvider | object) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleModelProviderChange = (provider: ModelProvider) => {
    const firstModel = VALID_MODELS[provider]?.[0] || "";
    setFormData((prev) => ({
      ...prev,
      modelProvider: provider,
      modelName: firstModel,
    }));
  };

  const handleLLMParamsChange = (updates: Partial<LLMParameters>) => {
    setLlmParams((prev) => ({ ...prev, ...updates }));
  };

  const handleSendMessage = () => {
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: t("dashboard.agents.form.validation.error"),
        description: t("dashboard.agents.form.validation.fillRequired"),
        variant: "destructive",
      });
      return;
    }

    // Prepare model config from LLM parameters
    const modelConfig = {
      temperature: llmParams.temperature,
      top_p: llmParams.topP,
      max_tokens: llmParams.maxTokens,
      top_k: llmParams.topK,
      frequency_penalty: llmParams.frequencyPenalty,
      presence_penalty: llmParams.presencePenalty,
      stop_sequences: llmParams.stopSequences
        ? llmParams.stopSequences.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
        : undefined,
    };

    const submitData = {
      ...formData,
      departmentIds:
        selectedDepartmentIds && selectedDepartmentIds.length > 0
          ? selectedDepartmentIds.filter((id) => id !== "none").map((id) => parseInt(id))
          : undefined,
      modelConfig,
    };

    if (isEditMode && agentId) {
      updateAgent(
        { id: agentId, data: submitData },
        {
          onSuccess: () => {
            router.push("/dashboard/agents");
          },
        }
      );
    } else {
      createAgent(submitData, {
        onSuccess: () => {
          router.push("/dashboard/agents");
        },
      });
    }
  };

  const handleBack = () => {
    router.push("/dashboard/agents");
  };

  return {
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
    validModels: VALID_MODELS,
    
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
  };
};

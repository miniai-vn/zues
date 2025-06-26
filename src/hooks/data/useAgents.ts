import { axiosInstance } from "@/configs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { PaginatedResponse } from "@/types/api";

export enum AgentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  TRAINING = "training",
  MAINTENANCE = "maintenance",
}

export enum ModelProvider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  DEEPSEEK = "deepseek",
  GOOGLE = "google",
  LOCAL = "local",
}

export interface Agent {
  id: number;
  name: string;
  modelProvider: ModelProvider;
  modelName: string;
  prompt: string;
  status: AgentStatus;
  modelConfig?: Record<string, any>;
  description?: string;
  shop?: {
    id: number;
    name: string;
  };
  users?: Array<{
    id: number;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentDto {
  name: string;
  modelProvider: ModelProvider;
  modelName: string;
  prompt: string;
  status?: AgentStatus;
  modelConfig?: Record<string, any>;
  description?: string;
  shopId?: number;
  userIds?: number[];
}

export interface UpdateAgentDto extends Partial<CreateAgentDto> {}

export interface QueryAgentDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: AgentStatus;
  modelProvider?: ModelProvider;
  shopId?: number;
}

export interface AvailableModel {
  id: string;
  name: string;
  description?: string;
  provider: ModelProvider;
}

const useAgents = ({
  page = 1,
  limit = 10,
  search = "",
  status,
  modelProvider,
  shopId,
}: QueryAgentDto = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all agents with pagination and filtering
  const {
    data: agentsResponse,
    isLoading: isLoadingAgents,
    error: fetchAgentsError,
    refetch: refetchAgents,
  } = useQuery({
    queryKey: [
      "agents",
      { page, limit, search, status, modelProvider, shopId },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/agents", {
        params: { page, limit, search, status, modelProvider, shopId },
      });
      return response.data as PaginatedResponse<Agent>;
    },
  });

  // Get single agent by ID
  const useAgent = (id: number) => {
    return useQuery({
      queryKey: ["agent", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/api/agents/${id}`);
        return response.data as Agent;
      },
      enabled: !!id,
    });
  };

  // Get available models for a provider
  const useAvailableModels = (provider: ModelProvider) => {
    return useQuery({
      queryKey: ["models", provider],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/api/agents/models/${provider}`
        );
        return response.data as AvailableModel[];
      },
      enabled: !!provider,
    });
  };

  // Create new agent
  const {
    mutate: createAgent,
    isPending: isCreatingAgent,
    error: createAgentError,
  } = useMutation({
    mutationFn: async (data: CreateAgentDto) => {
      const response = await axiosInstance.post("/api/agents", data);
      return response.data as Agent;
    },
    onSuccess: (data) => {
      toast({
        title: "Agent created",
        description: `Agent "${data.name}" has been successfully created.`,
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating agent",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  // Update agent
  const {
    mutate: updateAgent,
    isPending: isUpdatingAgent,
    error: updateAgentError,
  } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAgentDto }) => {
      const response = await axiosInstance.patch(`/api/agents/${id}`, data);
      return response.data as Agent;
    },
    onSuccess: (data) => {
      toast({
        title: "Agent updated",
        description: `Agent "${data.name}" has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", data.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating agent",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  // Delete agent
  const {
    mutate: deleteAgent,
    isPending: isDeletingAgent,
    error: deleteAgentError,
  } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/agents/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      toast({
        title: "Agent deleted",
        description: "The agent has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.removeQueries({ queryKey: ["agent", id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting agent",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  // Activate agent
  const {
    mutate: activateAgent,
    isPending: isActivatingAgent,
    error: activateAgentError,
  } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.put(`/api/agents/${id}/activate`);
      return response.data as Agent;
    },
    onSuccess: (data) => {
      toast({
        title: "Agent activated",
        description: `Agent "${data.name}" has been successfully activated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", data.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error activating agent",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  // Deactivate agent
  const {
    mutate: deactivateAgent,
    isPending: isDeactivatingAgent,
    error: deactivateAgentError,
  } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.put(`/api/agents/${id}/deactivate`);
      return response.data as Agent;
    },
    onSuccess: (data) => {
      toast({
        title: "Agent deactivated",
        description: `Agent "${data.name}" has been successfully deactivated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", data.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deactivating agent",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    agents: agentsResponse || [],
    agentsResponse,

    // Loading states
    isLoadingAgents,
    isCreatingAgent,
    isUpdatingAgent,
    isDeletingAgent,
    isActivatingAgent,
    isDeactivatingAgent,

    // Errors
    fetchAgentsError,
    createAgentError,
    updateAgentError,
    deleteAgentError,
    activateAgentError,
    deactivateAgentError,

    // Actions
    createAgent,
    updateAgent,
    deleteAgent,
    activateAgent,
    deactivateAgent,
    refetchAgents,

    // Nested hooks
    useAgent,
    useAvailableModels,
  };
};

export default useAgents;

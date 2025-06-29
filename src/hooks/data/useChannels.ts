import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
export enum ChannelStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface Channel {
  id: number;
  name: string;
  type: string;
  url?: string;
  avatar?: string; // Add this field for avatar
  audience_size?: number;
  description?: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  authCredentials?: Record<string, any>;
  extraData?: ZaloOAConfig | FacebookMessageConfig;
  apiStatus?: string;
  createdAt: string;
  updatedAt: string;
  status: ChannelStatus;
  isUseProductFromMiniapp?: boolean;
  department: {
    id: number;
    name: string;
  };
}

interface ZaloOAConfig {
  oaId: string;
}
interface FacebookMessageConfig {
  pageId: string;
  appId: string;
  appSecret: string;
  accessToken: string;
}

const useChannels = ({
  page = 1,
  limit = 10,
  search = "",
  departmentId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number;
} = {}) => {
  const { toast } = useToast();

  const {
    data: channels,
    isLoading: isLoadingChannels,
    error: fetchChannelsError,
    refetch: refetchChannels,
  } = useQuery({
    queryKey: ["channels", { page, limit }],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/channels", {
        params: { page, limit },
      });
      return response.data.items as Channel[];
    },
  });

  const {
    data: filteredChannels,
    isLoading: isLoadingFilteredChannels,
    error: fetchFilteredChannelsError,
  } = useQuery({
    queryKey: ["channels", { search, departmentId }],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/channels/query", {
        params: { search, departmentId },
      });
      return response.data as Channel[];
    },
  });

  const {
    mutate: deleteChannel,
    isPending: isDeletingChannel,
    error: deleteChannelError,
  } = useMutation({
    mutationFn: async (channelId: number) => {
      const response = await axiosInstance.delete(`/api/channels/${channelId}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Channel deleted",
        description: "The channel has been successfully deleted.",
      });
      refetchChannels();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting channel",
        description: error.message,
      });
    },
  });

  const { mutate: updateShopId } = useMutation({
    mutationFn: async (data: { appId: string }) => {
      const response = await axiosInstance.patch(`/api/channels/update-shop`, {
        appId: data.appId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Shop ID updated",
        description: "The shopID has been successfully updated.",
      });
      refetchChannels();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating shop ID",
        description: error.message,
      });
    },
  });

  const { mutate: syncConversations } = useMutation({
    mutationFn: async (appId: string) => {
      const response = await axiosInstance.post(
        `/api/integration/zalo/sync-conversations/${appId}`
      );
      return response.data;
    },
  });

  const { mutate: syncConversationsLazada } = useMutation({
    mutationFn: async (appId: string) => {
      const response = await axiosInstance.post(
        `/api/integration/lazada/sync-conversations/${appId}`
      );
      return response.data;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({
      channelId,
      status,
    }: {
      channelId: number;
      status: ChannelStatus;
    }) => {
      const response = await axiosInstance.patch(
        `/api/channels/${channelId}/status`,
        {
          status,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Channel status updated",
        description: "The channel status has been successfully updated.",
      });
      refetchChannels();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating channel status",
        description: error.message,
      });
    },
  });

  return {
    updateStatus,

    filteredChannels,
    isLoadingFilteredChannels,
    fetchFilteredChannelsError,
    updateShopId,
    channels,
    isLoadingChannels,
    fetchChannelsError,
    refetchChannels,
    deleteChannel,
    isDeletingChannel,
    deleteChannelError,
    syncConversations,
    syncConversationsLazada,
  };
};

export default useChannels;

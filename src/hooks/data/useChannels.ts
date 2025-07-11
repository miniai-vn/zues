import { axiosInstance } from "@/configs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  users: {
    id: string;
  }[];
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
  id,
}: {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number;
  id?: number;
} = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    data: channelDetail,
    isLoading: isLoadingChannelDetail,
    error: fetchChannelDetailError,
    refetch: refetchChannelDetail,
  } = useQuery<Channel, Error>({
    queryKey: ["channelDetail", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/channels/${id}`);
      return response.data as Channel;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
        `/api/integration/zalo/sync-conversations/${appId}`,
      );
      return response.data;
    },
  });

  const { mutate: syncFaceBookConversations } = useMutation({
    mutationFn: async (appId: string) => {
      const response = await axiosInstance.post(
        `/api/facebook/sync-conversations/${appId}`,
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
        },
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

  const { mutateAsync: addUsersToChannel } = useMutation({
    mutationFn: async ({
      channelId,
      userIds,
    }: {
      channelId: number;
      userIds: string[];
    }) => {
      const response = await axiosInstance.post(
        `/api/channels/${channelId}/add-users`,
        {
          userIds,
        },
      );
      return response.data;
    },
    onSuccess: async () => {
      toast({
        title: "Users added to channel",
        description:
          "The selected users have been successfully added to the channel.",
      });
      queryClient.invalidateQueries({
        queryKey: ["channelDetail", id],
      });
      await refetchChannels();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding users to channel",
        description: error.message,
      });
    },
  });

  const { mutateAsync: removeUsersFromChannel } = useMutation({
    mutationFn: async ({
      channelId,
      userIds,
    }: {
      channelId: number;
      userIds: string[];
    }) => {
      const response = await axiosInstance.post(
        `/api/channels/${channelId}/remove-users`,
        {
          userIds,
        },
      );
      return response.data;
    },
    onSuccess: async () => {
      toast({
        title: "Users removed from channel",
        description:
          "The selected users have been successfully removed from the channel.",
      });
      queryClient.invalidateQueries({
        queryKey: ["channelDetail", id],
      });
      await refetchChannels();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding users to channel",
        description: error.message,
      });
    },
  });

  return {
    channelDetail,
    isLoadingChannelDetail,
    fetchChannelDetailError,
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
    syncFaceBookConversations,
    addUsersToChannel,
    removeUsersFromChannel,
  };
};

export default useChannels;

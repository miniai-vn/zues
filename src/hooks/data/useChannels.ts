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
    data: channelData,
    isLoading: isFetchingChannels,
    refetch: refetchChannels,
  } = useQuery({
    queryKey: ["channels", page, limit, search, departmentId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (departmentId) params.append("departmentId", departmentId.toString());

      const queryString = params.toString();
      const endpoint = `/api/channels/get-by-shop-id${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axiosInstance.get(endpoint);

      return {
        items: res.data.items || res.data || [],
        totalCount: res.data.totalCount || res.data?.length || 0,
        page,
        limit,
      };
    },
    refetchOnWindowFocus: false,
  });

  // New hook: get channels by department id
  const useChannelsByDepartmentId = (departmentId?: number) => {
    return useQuery({
      queryKey: ["channels", "by-department", departmentId],
      enabled: !!departmentId,
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/api/channels/get-by-department-id`,
          {
            params: { departmentId },
          }
        );
        return (res.data as Channel[]) || [];
      },
    });
  };

  const {
    mutate: createChannel,
    isPending: isPendingCreateChannel,
    isSuccess: isCreatedChannel,
  } = useMutation({
    mutationFn: async (data: Partial<Channel>) => {
      const res = await axiosInstance.post("/api/channels/", data);
      return res.data;
    },
    onSuccess: () => {
      refetchChannels();
      toast({
        title: "Tạo kênh",
        description: "Tạo kênh thành công",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Tạo kênh",
        description: error.message,
      });
    },
  });

  const { mutate: updateChannel, isPending: isPendingUpdateChannel } =
    useMutation({
      mutationFn: async (data: Partial<Channel> & { id: number }) => {
        const res = await axiosInstance.put(`/api/channels/${data.id}`, data);
        return res.data;
      },
      onSuccess: () => {
        refetchChannels();
        toast({
          title: "Cập nhật kênh",
          description: "Cập nhật kênh thành công",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Cập nhật kênh",
          description: error.message,
        });
      },
    });

  const { mutate: deleteChannel, isPending: isPendingDeleteChannel } =
    useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/api/channels/${id}`);
      },
      onSuccess: () => {
        refetchChannels();
        toast({
          title: "Xóa kênh",
          description: "Xóa kênh thành công",
        });
      },
      onError: (error: any) => {
        refetchChannels();
        toast({
          title: "Xóa kênh",
          description: error.message,
        });
      },
    });

  const { mutate: updateChannelStatus } = useMutation({
    mutationFn: async (data: { id: number; status: ChannelStatus }) => {
      const res = await axiosInstance.patch(
        `/api/channels/${data.id}/update-status`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      refetchChannels();
      toast({
        title: "Cập nhật trạng thái kênh",
        description: "Cập nhật trạng thái kênh thành công",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Cập nhật trạng thái kênh",
        description: error.message,
      });
    },
  });

  return {
    channels: channelData?.items || [],
    totalCount: channelData?.totalCount || 0,
    page: channelData?.page || page,
    updateChannelStatus,
    limit: channelData?.limit || limit,
    isFetchingChannels,
    refetchChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    isPendingCreateChannel,
    isPendingUpdateChannel,
    isPendingDeleteChannel,
    isCreatedChannel,
    useChannelsByDepartmentId,
  };
};

export default useChannels;

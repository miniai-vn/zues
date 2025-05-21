import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export interface Channel {
  id: number;
  name: string;
  type: string;
  url: string;
  audience_size: number;
  description: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  refreshToken: string;
  authCredentials: Record<string, any>;
  extraData: Record<string, any>;
  apiStatus: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
}

const useChannels = () => {
  const { toast } = useToast();

  const {
    data: channels,
    isLoading: isFetchingChannels,
    refetch: refetchChannels,
  } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/channels/get-all");
      return (res.data as Channel[]) || [];
    },
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

  return {
    channels,
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

import { axiosInstance, chatApiInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
const useShopSettings = () => {
  const { toast } = useToast();
  // Lấy thông tin shop (nếu cần)
  const {
    data: shop,
    isLoading: isLoadingShop,
    isError: isErrorShop,
    refetch: refetchShop,
  } = useQuery({
    queryKey: ["shop_settings"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/shops/me");
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Cập nhật zaloId cho shop
  const mutation = useMutation({
    mutationFn: async (zaloId: string) => {
      const res = await axiosInstance.put("/api/shops/zalo-id", { zaloId });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Zalo ID đã được cập nhật.",
      });
      // Sau khi cập nhật thành công, có thể refetch lại dữ liệu shop
      refetchShop();
    },
    onError: (error) => {
      toast({
        title: "Cập nhật thất bại",
        description: "Đã xảy ra lỗi khi cập nhật Zalo ID.",
        variant: "destructive",
      });
      console.error("Error updating zaloId:", error);
    },
  });

  const {
    mutateAsync: syncDataShop,
    isPending: isSyncingDataShop,
    isError: isErrorSyncingDataShop,
    error: syncDataError,
    reset: resetSyncDataShop,
  } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch("/api/miniai/sync-shop");
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Đồng bộ thành công",
        description: "Dữ liệu shop đã được đồng bộ.",
      });
      refetchShop();
    },
    onError: (error) => {
      toast({
        title: "Đồng bộ thất bại",
        description: "Đã xảy ra lỗi khi đồng bộ dữ liệu shop.",
        variant: "destructive",
      });
      console.error("Error syncing shop data:", error);
    },
  });

  return {
    shop,
    isLoadingShop,
    isErrorShop,
    refetchShop,
    updateZaloId: mutation.mutate,
    syncDataShop,
    isSyncingDataShop,
    isErrorSyncingDataShop,
    syncDataError,

    ...mutation,
  };
};

export default useShopSettings;

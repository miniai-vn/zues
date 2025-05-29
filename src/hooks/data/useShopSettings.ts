import { axiosInstance, chatApiInstance } from "@/configs";
import { useMutation } from "@tanstack/react-query";

const useShopSettings = () => {
  const mutation = useMutation({
    mutationFn: async (appId: string) => {
      const res = await axiosInstance.post("/api/shop-settings", { appId });
      return res.data;
    },
  });

  return {
    updateShopSettings: mutation.mutate,
    ...mutation,
  };
};

export default useShopSettings;

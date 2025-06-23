import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export type WhiteLabel = {
  id: string;
  companyId: string;
  domainId: string;
  branding?: {
    logo: {
      url: string;
      altText: string;
    };
    favicon: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
  };
  customization?: {
    productName: string;
    emailSubject: string;
    emailSignature: string;
    supportEmail: string;
    termsUrl: string;
    privacyUrl: string;
    welcomeMessage: string;
    metaTags: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  features?: {
    chat: boolean;
    analytics: boolean;
    fileUpload: boolean;
    multiLanguage: boolean;
  };
  updatedAt: string;
};

const useWhiteLabel = () => {
  const { toast } = useToast();

  const {
    data: whiteLabel,
    isFetching: isFetchingWhiteLabel,
    refetch: refetchWhiteLabel,
  } = useQuery({
    queryKey: ["whiteLabel"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/whitelabel");
      return res.data as WhiteLabel;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: createWhiteLabel, isPending: isPendingCreateWhiteLabel } =
    useMutation({
      mutationFn: async (data: Partial<WhiteLabel>) => {
        const res = await axiosInstance.post("/api/whitelabel", data);
        return res.data;
      },
      onSuccess: () => {
        refetchWhiteLabel();
        toast({ title: "Tạo cấu hình WhiteLabel", description: "Thành công" });
      },
      onError: (error: any) => {
        toast({ title: "Lỗi tạo WhiteLabel", description: error.message });
      },
    });

  const { mutate: updateWhiteLabel, isPending: isPendingUpdateWhiteLabel } =
    useMutation({
      mutationFn: async (data: Partial<WhiteLabel> & { id: string }) => {
        const res = await axiosInstance.put(
          `/api/whitelabel/${data.id}`,
          data
        );
        return res.data;
      },
      onSuccess: () => {
        refetchWhiteLabel();
        toast({ title: "Cập nhật WhiteLabel", description: "Thành công" });
      },
      onError: (error: any) => {
        toast({ title: "Lỗi cập nhật WhiteLabel", description: error.message });
      },
    });

  const { mutate: deleteWhiteLabel, isPending: isPendingDeleteWhiteLabel } =
    useMutation({
      mutationFn: async (_id: string) => {
        await axiosInstance.delete(`/api/whitelabel/${_id}`);
      },
      onSuccess: () => {
        refetchWhiteLabel();
        toast({ title: "Xóa WhiteLabel", description: "Thành công" });
      },
      onError: (error: any) => {
        toast({ title: "Lỗi xóa WhiteLabel", description: error.message });
      },
    });

  return {
    whiteLabel,
    isFetchingWhiteLabel,
    refetchWhiteLabel,
    createWhiteLabel,
    isPendingCreateWhiteLabel,
    updateWhiteLabel,
    isPendingUpdateWhiteLabel,
    deleteWhiteLabel,
    isPendingDeleteWhiteLabel,
  };
};

export default useWhiteLabel;

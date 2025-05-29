"use client";
import { axiosInstance, chatApiInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  department_id: string;
  shop_id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface UseFAQsProps {
  departmentId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const useFAQs = ({
  departmentId,
  page = 1,
  limit = 10,
  search = "",
}: UseFAQsProps) => {
  const { toast } = useToast();

  const {
    data: faqsData,
    isPending: isPendingFetchingFaqs,
    refetch: refetchFaqs,
  } = useQuery({
    queryKey: ["faqs", departmentId, page, limit, search],
    queryFn: async () => {
      const params: any = { page, limit, search };
      if (departmentId) params.department_id = departmentId;
      const response = await chatApiInstance.get("/api/faqs/all", { params });
      // Expecting { items: FAQ[], totalCount: number }
      return {
        items: response.data.items || response.data.faqs || [],
        totalCount: response.data.totalCount || response.data.faqs?.length || 0,
        page,
        limit,
      };
    },
    enabled: !!departmentId,
    refetchOnWindowFocus: false,
  });

  const { mutate: createFAQ, isPending: isPendingCreateFAQ } = useMutation({
    mutationFn: async (data: {
      question: string;
      answer: string;
      department_id: string;
      shop_id?: string;
    }) => {
      const response = await chatApiInstance.post("/api/faqs/", data);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Tạo FAQ", description: "Tạo FAQ thành công" });
      refetchFaqs();
    },
    onError: (error: any) => {
      toast({ title: "Tạo FAQ", description: error.message });
    },
  });

  const { mutate: updateFAQ, isPending: isPendingUpdateFAQ } = useMutation({
    mutationFn: async (data: {
      id: string;
      question: string;
      answer: string;
    }) => {
      const response = await chatApiInstance.put(`/api/faqs/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Cập nhật FAQ", description: "Cập nhật FAQ thành công" });
      refetchFaqs();
    },
    onError: (error: any) => {
      toast({ title: "Cập nhật FAQ", description: error.message });
    },
  });

  const { mutate: deleteFAQ, isPending: isPendingDeleteFAQ } = useMutation({
    mutationFn: async (id: string) => {
      const response = await chatApiInstance.delete(`/api/faqs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Xóa FAQ", description: "Xóa FAQ thành công" });
      refetchFaqs();
    },
    onError: (error: any) => {
      toast({ title: "Xóa FAQ", description: error.message });
    },
  });

  return {
    faqs: faqsData,
    isPendingFetchingFaqs,
    isPendingCreateFAQ,
    isPendingUpdateFAQ,
    isPendingDeleteFAQ,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refetchFaqs,
  };
};

export default useFAQs;

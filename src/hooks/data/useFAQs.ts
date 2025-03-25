"use client";
import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
export type FAQs = {
  id?: string;
  question: string;
  answer: string;
  updatedAt?: string;
  createdAt?: string;
};

interface UseFAQsProps {
  page: number;
  limit: number;
  search: string;
}

const fetchFAQs = async (page: number, limit: number, search: string) => {
  const response = await axiosInstance.get("/api/faqs/", {
    params: { page, limit, search },
  });
  return response.data.faqs || [];
};

const useFAQs = ({ page, limit, search }: UseFAQsProps) => {
  const { toast } = useToast();
  const {
    data: faqs,
    isLoading: isLoadingFAQs,
    refetch,
  } = useQuery({
    queryKey: ["faqs", page, limit],
    queryFn: () => fetchFAQs(page, limit, search),
  });

  const { mutate: createFAQ } = useMutation({
    mutationFn: async (data: { question: string; answer: string }) => {
      const response = await axiosInstance.post("/api/faqs/", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Create FAQ",
        description: "Create FAQ successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Create FAQ",
        description: error.message,
      });
    },
  });

  const { mutate: updateFAQ } = useMutation({
    mutationFn: async (data: {
      id: string;
      question: string;
      answer: string;
    }) => {
      const response = await axiosInstance.put(`/api/faqs/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Update FAQ",
        description: "Update FAQ successfully",
      });
      refetch();
    },

    onError: (error) => {
      toast({
        title: "Update FAQ",
        description: error.message,
      });
    },
  });

  const { mutate: deleteFAQ } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/faqs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Delete FAQ",
        description: "Delete FAQ successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete FAQ",
        description: error.message,
      });
    },
  });

  return { faqs, isLoadingFAQs, createFAQ, updateFAQ, deleteFAQ };
};

export { useFAQs };

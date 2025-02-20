import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";

export type FAQs = {
  id?: string;
  question: string;
  answer: string;
  updatedAt?: string;
  createdAt?: string;
};
const useFAQs = () => {
  const {
    data: faqs,
    isLoading: isLoadingFAQs,
    refetch,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/faqs");
      return response.data;
    },
  });

  const { mutate: createFAQ } = useMutation({
    mutationFn: async (data: { question: string; answer: string }) => {
      const response = await axiosInstance.post("/api/faqs", data);
      return response.data;
    },
    onSuccess: () => {
      refetch();
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
      refetch();
    },
  });

  const { mutate: deleteFAQ } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/faqs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return { faqs, isLoadingFAQs, createFAQ, updateFAQ, deleteFAQ };
};

export { useFAQs };

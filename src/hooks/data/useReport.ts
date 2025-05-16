"use client";
import axiosInstance from "@/configs";
import { useQuery } from "@tanstack/react-query";
type TokenUsage = {
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
};
const useReport = () => {
  const { data: tokenUsage, isPending: isFetchingTokenUsage } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/reports/token-usage");
      return res.data as TokenUsage;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return {
    tokenUsage,
    isFetchingTokenUsage,
  };
};

export { useReport };

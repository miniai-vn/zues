import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { useEffect, useState } from "react";

export type DnsRecord = {
  type: string;
  name: string;
  value: string;
  status: string;
};

export type Domain = {
  id?: string;
  domain: string;
  companyId: string;
  isPrimary: boolean;
  status: string;
  dnsVerified: boolean;
  sslStatus: string;
  createdAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  dnsRecords: DnsRecord[];
};

const useDomain = ({
  companyId,
  search,
}: { companyId?: string; search?: string } = {}) => {
  const { toast } = useToast();

  const {
    data: domain,
    isLoading: isFetchingDomains,
    refetch: refetchDomains,
  } = useQuery({
    queryKey: ["domain", companyId, search],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/domains", {
        params: { companyId, search },
      });
      return res.data as Domain;
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: createDomain,
    isPending: isPendingCreateDomain,
    isSuccess: isCreatedDomain,
  } = useMutation({
    mutationFn: async (data: { domain: string }) => {
      const res = await axiosInstance.post("/api/domains", data);
      return res.data;
    },
    onSuccess: () => {
      refetchDomains();
      toast({
        title: "Tạo domain",
        description: "Tạo domain thành công",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Tạo domain",
        description: error.message,
      });
    },
  });

  const { mutate: updateDomain, isPending: isPendingUpdateDomain } =
    useMutation({
      mutationFn: async (data: Domain) => {
        const res = await axiosInstance.put(`/api/domains/${data.id}`, data);
        return res.data;
      },
      onSuccess: () => {
        refetchDomains();
        toast({
          title: "Cập nhật domain",
          description: "Cập nhật domain thành công",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Cập nhật domain",
          description: error.message,
        });
      },
    });

  const { mutate: deleteDomain, isPending: isPendingDeleteDomain } =
    useMutation({
      mutationFn: async (id: string) => {
        await axiosInstance.delete(`/api/domains/${id}`);
      },
      onSuccess: () => {
        refetchDomains();
        toast({
          title: "Xóa domain",
          description: "Xóa domain thành công",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Xóa domain",
          description: error.message,
        });
      },
    });

  return {
    domain,
    isFetchingDomains,
    refetchDomains,
    createDomain,
    isPendingCreateDomain,
    isCreatedDomain,
    updateDomain,
    isPendingUpdateDomain,
    deleteDomain,
    isPendingDeleteDomain,
  };
};

export default useDomain;

import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tag } from "./useTags";
import { Channel } from "../useChannels";
import { PaginatedResponse } from "@/types/api";

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  channelId?: number;
  tags: Tag[];
  channel: Channel;
  note?: string;
  phone?: string;
  address?: string;
  email?: string;
  externalId?: string;
}
export function useCustomer({
  queryParams,
  id,
}: {
  queryParams?: {
    channelId?: number;
    search?: string;
  };
  id?: string;
}) {
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", queryParams],
    queryFn: async () => {
      const response: PaginatedResponse<Customer> = await axiosInstance.get(
        "/api/customers/query",
        {
          params: queryParams,
        }
      );
      return (response.data as Customer[]) || [];
    },
    refetchOnWindowFocus: false,
  });

  const { data: customer } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: updateCustomer } = useMutation({
    mutationFn: async (customerData: Customer) => {
      const response = await axiosInstance.put(
        `/api/customers/${id}`,
        customerData
      );
      return response.data;
    },
  });

  return {
    customers,
    isLoadingCustomers,
    customer,
    updateCustomer,
  };
}

import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export interface Customer {
  id: string;
  platform: string;
  externalId: string;
  name: string;
  shopId?: string;
  avatar?: string;
  channelId?: number;
  address?: string;
  phone?: string;
  email?: string;
  notes?: string;
  shop?: {
    id: string;
    name: string;
  };
  channel?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  platform: string;
  externalId: string;
  name: string;
  shopId?: string;
  channelId?: number;
}

export interface UpdateCustomerDto {
  platform?: string;
  externalId?: string;
  name?: string;
  shopId?: string;
  channelId?: number;
}

export interface CustomerListQueryDto {
  platform?: string;
  shopId?: string;
  channelId?: number;
  name?: string;
  page?: number;
  limit?: number;
}

export interface CustomerListResponseDto {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseCustomersProps {
  query?: CustomerListQueryDto;
  id?: string;
}

const useCustomers = ({ query = {}, id }: UseCustomersProps = {}) => {
  const { toast } = useToast();

  // Get all customers with filtering and pagination
  const {
    data: customerList,
    isLoading: isFetchingCustomers,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", query],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/customers", {
        params: query,
      });
      return res.data as CustomerListResponseDto;
    },
    enabled: !id,
  });

  // Get single customer by ID
  const {
    data: customer,
    isLoading: isFetchingCustomer,
    refetch: refetchCustomer,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/customers/${id}`);
      return res.data as Customer;
    },
    enabled: !!id, // Only fetch single customer when id is provided
  });

  // Create customer
  const { mutate: createCustomer } = useMutation({
    mutationFn: async (newCustomer: CreateCustomerDto) => {
      const res = await axiosInstance.post("/api/customers", newCustomer);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Customer created successfully",
        description: "The customer has been added",
        variant: "default",
      });
      refetchCustomers();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create customer",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Update customer
  const { mutate: updateCustomer } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        phone?: string;
        email?: string;
        address?: string;
      };
    }) => {
      const res = await axiosInstance.put(`/api/customers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Customer updated successfully",
        description: "The customer information has been updated",
        variant: "default",
      });
      if (id) {
        refetchCustomer();
      }
      refetchCustomers();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update customer",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete customer
  const { mutate: deleteCustomer } = useMutation({
    mutationFn: async (customerId: string) => {
      await axiosInstance.delete(`/api/customers/${customerId}`);
    },
    onSuccess: () => {
      toast({
        title: "Customer deleted successfully",
        description: "The customer has been removed",
        variant: "default",
      });
      refetchCustomers();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete customer",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Find customers by platform
  const findByPlatform = async (platform: string) => {
    const res = await axiosInstance.get(`/api/customers/platform/${platform}`);
    return res.data as Customer[];
  };

  // Find customers by shop ID
  const findByShopId = async (shopId: string) => {
    const res = await axiosInstance.get(`/api/customers/shop/${shopId}`);
    return res.data as Customer[];
  };

  // Find customers by channel ID
  const findByChannelId = async (channelId: number) => {
    const res = await axiosInstance.get(`/api/customers/channel/${channelId}`);
    return res.data as Customer[];
  };

  // Search customers by name
  const searchByName = async (name: string) => {
    const res = await axiosInstance.get(`/api/customers/search`, {
      params: { name },
    });
    return res.data as Customer[];
  };

  return {
    // Data
    customers: customerList?.data || [],
    customer,
    pagination: customerList
      ? {
          total: customerList.total,
          page: customerList.page,
          limit: customerList.limit,
          totalPages: customerList.totalPages,
        }
      : undefined,

    // Loading states
    isFetchingCustomers,
    isFetchingCustomer,

    // Mutation functions
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // Query functions
    findByPlatform,
    findByShopId,
    findByChannelId,
    searchByName,

    // Refetch functions
    refetchCustomers,
    refetchCustomer,
  };
};

export default useCustomers;

import axiosInstance from "@/configs";
import { useQuery } from "@tanstack/react-query";
import { User } from "../useAuth";

// Add this new hook specifically for CS users with filters
export const useUsersWithCs = ({
  search = "",
  type = undefined,
  enabled = true,
}: {
  search?: string;
  type?: string;
  enabled?: boolean;
}) => {
  const {
    data: users = [],
    isLoading: isFetchingUsersWithCs,
    error: fetchUsersError,
    refetch: refetchUsers,
  } = useQuery<User[], Error>({
    queryKey: ["user", "withCs", { search, type }],
    queryFn: async () => {
      const params: Record<string, string> = {};

      if (search) params.search = search;
      if (type) params.type = type;

      const response = await axiosInstance.get("/api/users", { params });

      return (response?.data as User[]) ?? [];
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    users,
    isFetchingUsersWithCs,
    fetchUsersError,
    refetchUsers,
  };
};

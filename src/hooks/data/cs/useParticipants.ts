import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/configs";
import { User } from "../useAuth";

export type Participant = {
  id: number;
  conversationId?: string;
  memberType: "customer" | "user";
  customerId?: string;
  userId?: string;
  leftAt?: string;
  createdAt: string;
  systemId: string;
  updatedAt: string;
  name?: string; // For customer, this is the customer's name
  avatar?: string; // For customer, this is the customer's avatar
  user?: User;
  role?: string; // Keep this for backward compatibility
};

const useParticipants = (conversationId?: string) => {
  const queryClient = useQueryClient();

  // Fetch participants for a specific conversation
  const {
    data: participants = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["participants", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const response = await axiosInstance.get(
        `/api/conversations/${conversationId}/participants`
      );
      return response.data as Participant[];
    },
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
  });

  // Add participants mutation
  const { mutate: addParticipants, isPending: isAddingParticipants } =
    useMutation({
      mutationFn: async (data: {
        conversationId?: string;
        participantIds: string[];
      }) => {
        const response = await axiosInstance.post(
          `/api/conversations/${data.conversationId}/participants`,
          {
            userIds: data.participantIds,
          }
        );
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate and refetch participants
        queryClient.invalidateQueries({
          queryKey: ["participants", variables.conversationId],
        });

        // Also invalidate conversations to update the UI
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });

        toast({
          title: "Thêm thành viên thành công",
          description: "Thành viên đã được thêm vào cuộc trò chuyện",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error adding participants:", error);
        toast({
          title: "Thêm thành viên thất bại",
          description: "Không thể thêm thành viên vào cuộc trò chuyện",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  // Remove participants mutation
  const { mutate: removeParticipant, isPending: isRemovingParticipant } =
    useMutation({
      mutationFn: async (data: {
        conversationId?: string;
        participantIds: number[];
      }) => {
        const response = await axiosInstance.delete(
          `/api/conversations/${data.conversationId}/participants`,
          {
            data: {
              participantIds: data.participantIds,
            },
          }
        );
        return response.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate and refetch participants
        queryClient.invalidateQueries({
          queryKey: ["participants", variables.conversationId],
        });

        // Also invalidate conversations to update the UI
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });

        toast({
          title: "Xóa thành viên thành công",
          description: "Thành viên đã được xóa khỏi cuộc trò chuyện",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error removing participant:", error);
        toast({
          title: "Xóa thành viên thất bại",
          description: "Không thể xóa thành viên khỏi cuộc trò chuyện",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  // Update participant role mutation
  const { mutate: updateParticipantRole, isPending: isUpdatingRole } =
    useMutation({
      mutationFn: async (data: {
        conversationId?: string;
        participantId: number;
        role: string;
      }) => {
        const response = await axiosInstance.patch(
          `/api/conversations/${data.conversationId}/participants/${data.participantId}`,
          {
            role: data.role,
          }
        );
        return response.data;
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["participants", variables.conversationId],
        });

        toast({
          title: "Cập nhật quyền thành công",
          description: "Quyền của thành viên đã được cập nhật",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error updating participant role:", error);
        toast({
          title: "Cập nhật quyền thất bại",
          description: "Không thể cập nhật quyền của thành viên",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  return {
    // Data
    participants,

    // Loading states
    isLoading,
    isAddingParticipants,
    isRemovingParticipant,
    isUpdatingRole,

    // Error state
    error,

    // Actions
    addParticipants,
    removeParticipant,
    updateParticipantRole,
    refetch,
  };
};

export default useParticipants;

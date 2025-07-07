import axiosInstance from "@/configs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const useConversations = () => {
  const { toast } = useToast();
  const { mutate: updateConversationStatusBot } = useMutation({
    mutationFn: async (conversationId: number) => {
      return await axiosInstance.patch("/api/conversations/status-bot", {
        conversationId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
      });
    },
    onError: (error) => {
      console.error("Error updating conversation status bot:", error);
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật trạng thái bot cho cuộc trò chuyện",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  return {
    updateConversationStatusBot,
  };
};
export default useConversations;

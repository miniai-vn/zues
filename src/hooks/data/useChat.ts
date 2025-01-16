import axiosInstance from "@/configs";
export type Message = {
  id: number;
  content: string;
  createAt: string;
  isBot: boolean;
};
const useChat = () => {
  const sendMessage = async (data: string) => {
    const response = await axiosInstance.post("/api/chat", {
      content: data,
    });
    return response.data;
  };
  return { sendMessage };
};

export { useChat };

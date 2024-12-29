import axiosInstance from "@/configs";
import { useMutation } from "@tanstack/react-query";

const useAuth = () => {
  const { mutate: signIn, isSuccess } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/login", data);
      return response;
    },
    onSuccess(data) {
      localStorage.setItem("token", data?.token);
    },
  });
  return { signIn, isSuccess };
};

export { useAuth };

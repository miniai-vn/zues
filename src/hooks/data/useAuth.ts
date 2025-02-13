import axiosInstance from "@/configs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const useAuth = () => {
  const router = useRouter();

  const { mutate: signIn, isSuccess } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/login", data);
      return response;
    },
    onSuccess(data: any) {
      const token = data.token;
      localStorage.setItem("token", token);
      router.push("/dashboard/bot");
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/register", data);
      return response;
    },
  });
  return { signIn, isSuccess, register };
};

export { useAuth };

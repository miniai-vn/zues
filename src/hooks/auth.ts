import { login, Login } from "@/services/login";
import { useMutation } from "@tanstack/react-query";

const useAuth = () => {
  const { mutate: signIn, isSuccess } = useMutation({
    mutationFn: async (data: Login) => {
      const response = await login(data);
      return response;
    },
  });
  return { signIn, isSuccess };
};

export { useAuth };

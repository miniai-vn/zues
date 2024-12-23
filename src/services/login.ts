import axiosInstance from "@/configs";

export type Login = {
  username: string;
  password: string;
};
const login = (data: Login) => {
  const response = axiosInstance.post("/auth/login", data);
  return response;
};

export { login };

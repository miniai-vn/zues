import axios from "axios";
import { toast } from "sonner";

// Instance cho API chính
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Instance cho Chat API
export const chatApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CHAT_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Interceptor cho cả 2 instance (nếu cần giống nhau)
const attachInterceptors = (instance: typeof axiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 403) {
          alert("Bạn không có quyền truy cập vào tài nguyên này!");
          // window.history.back();
          return;
        }
        if (status === 401) {
          localStorage.removeItem("token");
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1200);
        } else if (status === 404) {
          toast.error("Không tìm thấy tài nguyên!");
          window.history.back();
        } else if (status >= 500) {
          toast.error("Lỗi máy chủ. Vui lòng thử lại sau!");
        }
      } else if (error.request) {
        toast.error("Không nhận được phản hồi từ máy chủ!");
      } else {
        toast.error("Lỗi cấu hình request!");
      }
      return Promise.reject(error);
    }
  );
};

attachInterceptors(axiosInstance);
attachInterceptors(chatApiInstance);

export default axiosInstance;

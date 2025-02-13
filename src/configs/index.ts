import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    // Handle errors globally
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

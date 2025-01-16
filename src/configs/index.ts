import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Example: Set your API URL
  timeout: 30000, // Optional: Set timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add custom logic before the request is sent, e.g., attach tokens
    const token = localStorage.getItem("token"); // Example: Use your preferred storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

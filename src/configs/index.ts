import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

// Add response interceptor with better error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with an error status
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - token expired or invalid
        // Redirect to login or refresh token
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        // Forbidden - insufficient permissions
        console.error("Access forbidden");
      } else if (status === 404) {
        // Not found
        console.error("Resource not found");
      } else if (status >= 500) {
        // Server errors
        console.error("Server error occurred");
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received from server");
    } else {
      // Request setup error
      console.error("Request configuration error");
    }

    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

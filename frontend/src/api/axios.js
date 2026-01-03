import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:3000",
  withCredentials: false,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to headers automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message || "Something went wrong.";
    return Promise.reject(message);
  }
);

export default api;

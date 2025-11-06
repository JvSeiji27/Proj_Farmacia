import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // sua API backend
});

// Interceptor para incluir o token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
    
import axios from "axios";
import { useAuthStore } from "../store/auth";

// ✅ Defínelo fuera
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Añadir interceptor de petición para incluir el token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

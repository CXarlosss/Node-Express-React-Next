import axios from "axios";
import { useAuthStore } from "../store/auth";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Añadir interceptor de petición para incluir el token
api.interceptors.request.use(
  (config) => {
    // 👇 Esto es crucial: acceder al token de Zustand
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

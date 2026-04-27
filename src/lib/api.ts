import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("super-admin-token");

    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});

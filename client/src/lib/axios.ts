import axios from "axios";

import { BACKEND_URL } from "./constants";

import { useAuthStore } from "@/store/auth-store";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().user.accessToken;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;

            return api(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.get(`${BACKEND_URL}/auth/refresh`, {
          withCredentials: true,
        });
        const { accessToken, userId, role } = refreshResponse.data;

        useAuthStore.getState().setAuth({
          accessToken,
          role,
          userId,
        });
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return api(error.config);
      } catch (refreshError) {
        useAuthStore.getState().signout();
        window.location.replace("/auth/signin");
        processQueue(refreshError);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

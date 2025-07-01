import axios from "axios";

import { BACKEND_URL } from "./constants";
import { auth } from "./better-auth/auth";

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

// api.interceptors.request.use(
//   async (config) => {
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

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
        const { data } = await auth.getSession();

        if (!data) {
          throw new Error("Invalid session");
        }

        processQueue(null, null);

        return api(error.config);
      } catch (refreshError) {
        useAuthStore.getState().signout();
        window.location.replace("/auth/sign-in");
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

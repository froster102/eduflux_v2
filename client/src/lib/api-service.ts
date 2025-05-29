import axios from "axios";

import { BACKEND_URL } from "./constants";

import { useAuthStore } from "@/store/auth-store";

export async function refreshToken() {
  try {
    const refreshResponse = await axios.get(`${BACKEND_URL}/auth/refresh`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().user.accessToken}`,
      },
    });
    const { accessToken, userId, role } = refreshResponse.data as any;

    useAuthStore.getState().setAuth({
      accessToken,
      role,
      userId,
    });

    return { accessToken };
  } catch (refreshError) {
    useAuthStore.getState().signout();
    window.location.replace("/auth/signin");

    return Promise.reject(refreshError);
  }
}

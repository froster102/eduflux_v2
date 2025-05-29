// store/notification-store.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { addToast } from "@heroui/toast";

import { useAuthStore } from "./auth-store";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  notifications: AppNotification[];
}

interface SocketActions {
  connect: () => void;
  disconnect: () => void;
}

interface NotificationActions {
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<
  SocketState & SocketActions & NotificationActions
>((set, get) => ({
  socket: null,
  isConnected: false,
  notifications: [],

  connect: () => {
    const { socket } = get();

    if (socket) return;

    const accessToken = useAuthStore.getState().user.accessToken;
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    newSocket.connect();

    newSocket.on("connect", () => {
      set({ isConnected: true });
    });

    newSocket.on("notification", (data: AppNotification) => {
      set((state) => ({
        notifications: [...state.notifications, data],
      }));
    });

    newSocket.on("notifications", (data: AppNotification[]) => {
      set(() => ({
        notifications: data,
      }));
    });

    newSocket.on("error", (error: any) => {
      addToast({
        title: "Notification error",
        description: error.message,
      });
    });

    newSocket.on("disconnect", () => {
      set({ isConnected: false });
    });

    set({ socket: newSocket });
  },

  markAsRead: (notificationId: string) => {
    const { socket } = get();

    if (socket) {
      socket.emit("mark_as_read", { notificationId });
      const handler = (data: { id: string }) => {
        if (data.id === notificationId) {
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== notificationId,
            ),
          }));
          socket.off("notification_read", handler);
        }
      };

      socket.on("notification_read", handler);
    }
  },

  markAllAsRead: () => {
    const { socket } = get();

    if (socket) {
      socket.emit("mark_all_as_read");
      const handler = () => {
        set((state) => ({
          ...state,
          notifications: [],
        }));
        socket.off("marked_all_notification_as_read");
      };

      socket.on("marked_all_notification_as_read", handler);
    }
  },

  disconnect: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

import React from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";

import { NOTIFICATION_SSE_URL } from "@/lib/constants";
import { ServerEvents } from "@/shared/constants/ServerEvents";

export interface NotificationContextType {}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const eventSourceRef = React.useRef<EventSource | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const evtSourse = new EventSource(NOTIFICATION_SSE_URL, {
      withCredentials: true,
    });

    eventSourceRef.current = evtSourse;
    handleEvents(evtSourse);

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleEvents = (evtSource: EventSource) => {
    evtSource.addEventListener(
      ServerEvents.USER_NOTIFICATON,
      (e: MessageEvent) => {
        const data: AppNotification = JSON.parse(e.data);

        addToast({
          title: data.title,
          description: data.description,
        });

        queryClient.setQueryData(
          ["notifications"],
          (old: AppNotification[]) => [...old, data],
        );
      },
    );
  };

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

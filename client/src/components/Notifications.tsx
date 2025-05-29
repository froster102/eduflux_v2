import { Bell, Inbox } from "lucide-react";
import { Badge } from "@heroui/badge";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

import NotificationCard from "./NotificationCard";

import { useNotificationStore } from "@/store/notification-store";
import { formatTo12HourWithDate } from "@/utils/date";

interface NotificationsProps {}

export default function Notifications({}: NotificationsProps) {
  const [openNotifications, setOpenNotifications] = React.useState(false);
  const { notifications, connect, disconnect, markAsRead, markAllAsRead } =
    useNotificationStore();

  React.useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  function handleMarkNotificationAsRead(notificationId: string) {
    markAsRead(notificationId);
  }

  return (
    <>
      <Popover className="max-w-96" placement="bottom" size="lg">
        <PopoverTrigger>
          <button
            className="outline-none border-none"
            onClick={() => {
              setOpenNotifications(!openNotifications);
            }}
          >
            <Badge
              aria-label="more than 99 notifications"
              className="border-0"
              color="danger"
              content={notifications.length > 0 ? notifications.length : null}
              shape="circle"
              size="md"
            >
              <Bell />
            </Badge>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 bg-secondary-500">
          <div className="w-full">
            <div className="flex justify-between items-center px-2 py-2">
              <div className="flex items-center">
                <p className="font-semibold pr-2">Notifications</p>
                <Inbox size={16} />
              </div>
              <Button
                color="primary"
                isDisabled={notifications.length <= 0}
                radius="full"
                size="sm"
                onPress={markAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
            <Divider orientation="horizontal" />
            <div className="max-h-96 overflow-x-auto scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    id={notification.id}
                    markAsReadHandler={handleMarkNotificationAsRead}
                    message={notification.message}
                    status={notification.status}
                    timestamp={formatTo12HourWithDate(
                      new Date(notification.createdAt),
                    )}
                    title={notification.title}
                  />
                ))
              ) : (
                <small className="text-default-500 h-10 flex justify-center items-center">
                  There are no unread notifications
                </small>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

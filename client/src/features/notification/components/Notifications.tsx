import { Inbox } from "lucide-react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Card } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";

import NotificationIcon from "@/components/icons/NotificationIcon";
import { useGetNotifications } from "@/features/notification/useGetNotifications";
import NotificationCard from "@/features/notification/components/NotificationCard";
import { useMarkNotificationAsSeen } from "@/features/notification/useMarkNotificationAsSeen";
import WarnIcon from "@/components/icons/WarnIcon";

// import { useNotificationStore } from "@/store/notification-store";

interface NotificationsProps {}

export default function Notifications({}: NotificationsProps) {
  const {
    data: notifications,
    isPending: isNotificationsLoading,
    isError: isNotificationError,
  } = useGetNotifications();
  const [openNotifications, setOpenNotifications] = React.useState(false);
  const markNotificatonAsSeen = useMarkNotificationAsSeen();

  const markAsReadHandler = (id: string) => {
    markNotificatonAsSeen.mutate(id);
  };

  if (isNotificationError) {
    return (
      <Popover className="max-w-[424px] min-w-96" placement="bottom" size="lg">
        <PopoverTrigger>
          <Card
            isPressable
            className="p-1 bg-primary text-black "
            onPress={() => {
              setOpenNotifications(!openNotifications);
            }}
          >
            <NotificationIcon width={24} />
          </Card>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 border border-default-200 overflow-hidden">
          <div className="w-full">
            <div className="flex justify-between items-center px-2 py-2">
              <div className="flex items-center">
                <p className="font-semibold pr-2">Notifications</p>
                <Inbox size={16} />
              </div>
            </div>

            <div className="text-default-500 flex flex-col justify-center items-center">
              <WarnIcon />
              <small>Error loading notifications.</small>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <Popover className="max-w-[424px] min-w-96" placement="bottom" size="lg">
        <PopoverTrigger>
          <Button
            isIconOnly
            className="bg-transparent overflow-visible"
            radius="full"
            size="md"
            onPress={() => {
              setOpenNotifications(!openNotifications);
            }}
          >
            <Badge
              aria-label="more than 99 notifications"
              className="border-0 absolute"
              color="danger"
              content={
                notifications && notifications.data.length > 0
                  ? notifications.data.length
                  : null
              }
              shape="circle"
              size="md"
            >
              <NotificationIcon width={24} />
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 border border-default-200 overflow-hidden">
          <div className="w-full">
            <div className="flex justify-between items-center px-2 py-2">
              <div className="flex items-center">
                <p className="font-semibold pr-2">Notifications</p>
                <Inbox size={16} />
              </div>
              {/* {notifications && notifications.length > 0 && (
                <Button
                  color="primary"
                  // isDisabled={notifications.length <= 0}
                  radius="full"
                  size="sm"
                  // onPress={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )} */}
            </div>
            <div className="max-h-96 overflow-x-auto scrollbar-hide flex flex-col gap-2">
              {notifications && notifications.data.length > 0 ? (
                notifications.data.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsReadHandler}
                  />
                ))
              ) : (
                <small className="text-default-500 h-10 flex justify-center items-center">
                  There are no unread notifications
                </small>
              )}

              {isNotificationsLoading && (
                <div className="flex justify-center items-center pt-2">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

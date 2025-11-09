import { Card, CardBody, CardHeader } from '@heroui/card';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'motion/react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@heroui/button';
import { X } from 'lucide-react';

import { formatRelative } from '@/utils/date';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead: (notificationId: string) => void;
}

export default function NotificationCard({
  notification,
  onMarkRead,
}: NotificationCardProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <Card
          disableRipple
          className="border-0 border-t border-t-default-500"
          radius="none"
          shadow="none"
          onPress={() => {
            navigate({ to: notification.path });
          }}
        >
          <CardHeader className="p-0 pt-2 pl-2 flex justify-between">
            <small className="text-xs text-default-500 capitalize">
              {formatRelative(notification.timestamp)}
            </small>
            <Button
              isIconOnly
              className="p-0 bg-transparent"
              radius="full"
              size="sm"
              onPress={() => {
                onMarkRead(notification.id);
              }}
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardBody className="p-0 px-2 py-1">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-default-600">
                  {notification.description}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  status: string;
  timestamp: string;
  markAsReadHandler: (notificationId: string) => void;
}

export default function NotificationCard({
  id,
  title,
  message,
  status,
  timestamp,
  markAsReadHandler,
}: NotificationCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="p-2"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="p-0 px-2 pt-2 flex justify-between font-medium">
            <p>{title}</p>
            <Button
              isIconOnly
              className="p-0 bg-transparent"
              radius="full"
              size="sm"
              onPress={() => {
                markAsReadHandler(id);
              }}
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardBody className="p-0 px-2 py-2">
            <p className="text-sm">{message}</p>
          </CardBody>
          <CardFooter className="p-0 pb-2 px-2">
            <Chip size="sm" variant="flat">
              {status}
            </Chip>
            <small className="ml-auto text-xs">{timestamp}</small>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

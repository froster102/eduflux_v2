import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import React from "react";

import SendIcon from "@/components/icons/SendIcon";

export interface ChatPanelProps {
  currentUser: User;
  messages: Message[];
  recipient: UserProfile;
}

export default function ChatPanel({
  messages,
  recipient,
  currentUser,
}: ChatPanelProps) {
  const messageEndRef = React.useRef<HTMLDivElement | null>(null);

  console.log(currentUser);

  React.useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  let lastDate: string = "";

  const formatDate = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1 && now.getDate() === date.getDate()) {
      return "Today";
    } else if (diffInDays < 2 && now.getDate() - date.getDate() === 1) {
      return "Yesterday";
    } else {
      const options = { day: "numeric", month: "long", year: "numeric" };

      return date.toLocaleDateString("en-US", options);
    }
  };

  return (
    <Card className="w-full bg-background p-0 border border-default-200">
      <CardHeader className="p-0">
        <Card className="w-full">
          <CardBody className="p-4">
            <div className="flex items-center gap-2">
              <Avatar
                size="lg"
                src="https://heroui.com/images/hero-card-complete.jpeg"
              />
              <div>
                <p className="text-lg font-medium">{recipient.firstName}</p>
                <Chip className="border-0 p-0" color="success" variant="dot">
                  Online
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardHeader>
      <CardBody className="flex-1 overflow-y-auto pt-0">
        {messages.map((message) => {
          const currentDate = new Date(message.createdAt).toDateString();
          const showDateSeparator = currentDate !== lastDate;

          lastDate = currentDate;

          return (
            <React.Fragment key={message.id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              )}
              <div
                className={`w-full flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"} pt-2`}
              >
                <Card
                  className="border border-default-200 min-w-32"
                  shadow="none"
                >
                  <CardBody>
                    {message.content}
                    <small
                      className={`pt-0  text-right text-[0.6rem]  ${message.senderId === currentUser.id ? "text-white/80" : "text-gray-500"}`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </CardBody>
                </Card>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messageEndRef} />
      </CardBody>
      <CardFooter>
        <div className="w-full">
          <Input
            classNames={{
              inputWrapper: "h-14 bg-default-200/90",
            }}
            endContent={
              <Button isIconOnly color="primary" size="sm">
                <SendIcon />
              </Button>
            }
            name="message"
            placeholder="Message"
            type="text"
            variant="faded"
          />
        </div>
      </CardFooter>
    </Card>
  );
}

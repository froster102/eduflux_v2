import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import React from "react";
import { Form } from "@heroui/form";
import { Spinner } from "@heroui/spinner";

import SendIcon from "@/components/icons/SendIcon";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/useChatStore";
import { IMAGE_BASE_URL } from "@/config/image";
import { useChatContext } from "@/context/ChatContext";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { formatRelative } from "@/utils/date";

interface ChatPanelProps {
  messages: Message[];
  onScrollEnd: () => void;
  isFetchingNextPage: boolean;
}

export default function ChatPanel({
  messages,
  onScrollEnd,
  isFetchingNextPage,
}: ChatPanelProps) {
  const { user: currentUser } = useAuthStore();
  const { selectedChat } = useChatStore();
  const [textInput, setTextInput] = React.useState("");
  const { sendMessage } = useChatContext();
  const [autoScrollToBottom, setAutoScrollToBottom] = React.useState(true);

  const messageInputRef = React.useRef<HTMLInputElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = React.useRef<number>(0);

  const recipient = selectedChat
    ? selectedChat.participants.find(
        (participant) => participant.id !== currentUser!.id,
      )
    : null;

  const messageEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (autoScrollToBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
      setAutoScrollToBottom(false);
    }
  }, [autoScrollToBottom]);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight;

      if (prevScrollHeightRef.current > 0) {
        const heightDiff = currentScrollHeight - prevScrollHeightRef.current;

        scrollContainerRef.current.scrollTop += heightDiff;
      }
      prevScrollHeightRef.current = currentScrollHeight;
    }
  }, [messages.length]);

  let lastDate: string = "";

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(selectedChat!.id, textInput);
    setTextInput("");
    if (messageInputRef) {
      messageInputRef.current?.focus();
    }
    setAutoScrollToBottom(true);
  };

  return (
    <Card className="w-full bg-background p-0 border border-default-200">
      <CardHeader className="p-0">
        <Card className="w-full">
          <CardBody className="p-4">
            <div className="flex items-center gap-2">
              <Avatar size="lg" src={`${IMAGE_BASE_URL}${recipient?.image}`} />
              <div>
                <p className="text-lg font-medium capitalize">
                  {recipient!.firstName + " " + recipient!.lastName}
                </p>
                <Chip className="border-0 p-0" color="success" variant="dot">
                  Online
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardHeader>
      <CardBody className="flex-1  pt-0">
        <div ref={scrollContainerRef} className="overflow-y-auto">
          <InfiniteScrollContainer
            scrollDirection="top"
            onEndReached={() => {
              onScrollEnd();
            }}
          >
            {isFetchingNextPage && (
              <div className="flex w-full justify-center pt-4">
                <div>
                  <Spinner />
                </div>
              </div>
            )}
            {[...messages].reverse().map((message) => {
              const currentDate = new Date(message.createdAt).toDateString();
              const showDateSeparator = currentDate !== lastDate;

              lastDate = currentDate;

              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {formatRelative(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`w-full flex ${message.senderId === currentUser!.id ? "justify-end" : "justify-start"} pt-2`}
                  >
                    <Card
                      className="border border-default-200 min-w-32"
                      shadow="none"
                    >
                      <CardBody>
                        {message.content}
                        <small
                          className={`pt-0  text-right text-[0.6rem]  ${message.senderId === currentUser!.id ? "text-white/80" : "text-gray-500"}`}
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
          </InfiniteScrollContainer>
        </div>

        <div ref={messageEndRef} />
      </CardBody>
      <CardFooter>
        <div className="w-full">
          <Form onSubmit={onSubmit}>
            <Input
              ref={messageInputRef}
              classNames={{
                inputWrapper: "h-14 bg-default-200/90",
              }}
              endContent={
                <Button
                  isIconOnly
                  color="primary"
                  isDisabled={textInput === ""}
                  size="sm"
                  type="submit"
                >
                  <SendIcon />
                </Button>
              }
              name="message"
              placeholder="Message"
              type="text"
              value={textInput}
              variant="faded"
              onValueChange={setTextInput}
            />
          </Form>
        </div>
      </CardFooter>
    </Card>
  );
}

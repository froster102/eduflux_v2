import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { SendHorizontal } from "lucide-react";
import React from "react";
import { Form } from "@heroui/form";

import { MeetingContext, MeetingContextType } from "@/context/MeetingContext";

export default function MeetingMessager() {
  const [currentMessage, setCurrentMessage] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { messages, sendMessage } = React.useContext(
    MeetingContext,
  ) as MeetingContextType;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(currentMessage);
    setCurrentMessage("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <Card className="hidden max-w-md w-full p-2 md:flex md:flex-col h-full bg-background">
      <CardHeader>
        <p className="text-lg">In-call messages</p>
      </CardHeader>
      <Divider orientation="horizontal" />
      <CardBody className="overflow-y-auto scrollbar-hide scroll-smooth">
        {/* <div /> */}
        <div>
          {messages.map((message, i) => (
            <Card
              key={i}
              className={`bg-secondary-500 w-fit p-2 mt-1 ${message.type === "sent" ? "ml-auto" : ""}`}
              radius="sm"
              shadow="none"
            >
              {message.message}
            </Card>
          ))}
        </div>
      </CardBody>
      <CardFooter className="self-end">
        <Form className="w-full" onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            disableAnimation
            endContent={
              <Tooltip content="Send message">
                <Button
                  isIconOnly
                  className="bg-transparent"
                  isDisabled={currentMessage === ""}
                  radius="full"
                  type="submit"
                >
                  <SendHorizontal />
                </Button>
              </Tooltip>
            }
            placeholder="Send your message"
            radius="full"
            value={currentMessage}
            onValueChange={(value) => {
              setCurrentMessage(value);
            }}
          />
        </Form>
      </CardFooter>
    </Card>
  );
}

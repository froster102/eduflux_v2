import { Button } from "@heroui/button";
import { useChat } from "@ai-sdk/react";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { Form } from "@heroui/form";
import { ChevronUp } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { refreshToken } from "@/lib/api-service";
import { MemoizedMarkdown } from "@/features/student/chat-bot/components/MemoizedMarkdownBlock";
import PromptInput from "@/features/student/chat-bot/components/PromptInput";

export default function ChatbotPage() {
  const {
    user: { accessToken },
  } = useAuthStore();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${import.meta.env.VITE_NODE_ENV === "development" ? import.meta.env.VITE_BACKEND_DEVELOPMENT_URL : import.meta.env.VITE_BACKEND_PRODUCTION_URL}/chatbot`,
    fetch: async (url, request) => {
      const options: RequestInit = {
        ...request,
        headers: {
          ...request?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, options);

      if (response.status === 401) {
        const { accessToken: newAccessToken } = await refreshToken();

        return await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      }

      return response;
    },
  });

  return (
    <>
      <div className="w-full h-full flex justify-center pb-20">
        <div className="max-w-[724px] h-full w-full flex flex-col px-2">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="pt-2">
                  <Card className="ml-auto w-fit">
                    <CardBody>
                      <p>{message.content}</p>
                    </CardBody>
                  </Card>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <MemoizedMarkdown content={message.content} id={message.id} />
                </div>
              )}
              {/* <div className="font-bold mb-2">
                {message.role === "user" ? "You" : "Assistant"}
              </div> */}
            </div>
          ))}
          {messages.length <= 0 && (
            <div className="flex items-center h-full w-full">
              <div className="text-3xl">
                <p>Hello there!</p>
                <p className="text-default-500">How can I help you today?</p>
              </div>
            </div>
          )}
          <div className="max-w-[624px] w-full fixed bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center">
            <Form
              className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70"
              onSubmit={handleSubmit}
            >
              <PromptInput
                classNames={{
                  inputWrapper: "!bg-transparent shadow-none",
                  innerWrapper: "relative",
                  input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
                }}
                endContent={
                  <div className="flex items-end gap-2">
                    <Tooltip showArrow closeDelay={50} content="Send message">
                      <Button
                        isIconOnly
                        color={!prompt ? "default" : "primary"}
                        isDisabled={!prompt}
                        radius="lg"
                        size="sm"
                        variant="solid"
                      >
                        <Button
                          isIconOnly
                          color="primary"
                          radius="full"
                          type="submit"
                        >
                          <ChevronUp width={20} />
                        </Button>
                      </Button>
                    </Tooltip>
                  </div>
                }
                minRows={3}
                radius="lg"
                value={input}
                variant="flat"
                onChange={handleInputChange}
              />
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

import { Card, CardBody } from "@heroui/card";

import { MemoizedMarkdown } from "@/features/ai-chat/components/MemoizedMarkdownBlock";

interface MessageViewProps {
  id: string;
  message: string;
  role: "user" | "assistant";
}

export default function MessageView({ id, role, message }: MessageViewProps) {
  return (
    <div className="pt-2">
      {role === "user" ? (
        <Card className="ml-auto w-fit">
          <CardBody>
            <MemoizedMarkdown content={message} id={id} />
          </CardBody>
        </Card>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

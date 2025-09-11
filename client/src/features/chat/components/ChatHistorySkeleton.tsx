import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function ChatHistorySkeleton() {
  return (
    <Card className="w-full h-full bg-background border border-default-200">
      <CardHeader className="text-xl font-semibold">My Chats</CardHeader>
      <CardBody className="pt-0">
        {new Array(14).fill(0).map((_, i) => (
          <div key={i} className="pt-2">
            <Skeleton
              className="!bg-default-200 w-full h-12 rounded-lg"
              isLoaded={false}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input';
import { Skeleton } from '@heroui/skeleton';

import SendIcon from '@/components/icons/SendIcon';

export default function ChatPanelSkeleton() {
  const skeletonMessages = Array(12).fill(null);

  return (
    <Card className="w-full bg-background p-0 border border-default-200">
      <Skeleton className="!bg-default-200" isLoaded={false}>
        <CardHeader className="p-0">
          <Card className="w-full">
            <CardBody className="p-4">
              <div className="flex items-center gap-2">
                <Avatar
                  size="lg"
                  src="https://heroui.com/images/hero-card-complete.jpeg"
                />
                <div>
                  <p className="text-lg font-medium">recipient</p>
                  <Chip className="border-0 p-0" color="success" variant="dot">
                    Online
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </CardHeader>
      </Skeleton>
      <CardBody className="flex-1 overflow-y-auto pt-0">
        {skeletonMessages.map((_, idx) => (
          <div
            key={idx}
            className={`flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <div className="p-2">
              <Skeleton
                className="!bg-default-200 h-12 w-32 rounded-lg"
                isLoaded={false}
              />
            </div>
          </div>
        ))}
      </CardBody>
      <CardFooter>
        <div className="w-full">
          <Input
            classNames={{
              inputWrapper: 'h-14 bg-default-200/90',
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

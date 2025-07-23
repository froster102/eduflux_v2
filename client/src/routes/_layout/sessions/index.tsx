import { Card, CardBody } from "@heroui/card";
import { createFileRoute } from "@tanstack/react-router";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import VideoIcon from "@/assets/icons/VideoIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import ReviewIcon from "@/assets/icons/ReviewIcon";

export const Route = createFileRoute("/_layout/sessions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      {new Array(12).fill(0).map((_, i) => (
        <div key={i} className={`pt-2`}>
          <Card
            className="border border-default-200 bg-background"
            shadow="none"
          >
            <CardBody>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <User
                      avatarProps={{
                        size: "sm",
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                      }}
                      name="Jane Doe"
                    />
                    <Chip color="success" variant="flat">
                      Completed
                    </Chip>
                  </div>
                  <p>Fri Oct 12 </p>
                  <small>10.00AM - 11.00AM </small>
                  <p className="inline-flex text-xs items-center text-default-700 gap-1">
                    <ClockIcon width={16} />
                    15m
                  </p>
                  <p className="inline-flex text-xs items-center text-default-700 gap-1">
                    <VideoIcon width={16} />
                    App
                  </p>
                </div>
                <Button
                  className="text-sm"
                  color="primary"
                  size="sm"
                  startContent={<ReviewIcon width={16} />}
                  variant="bordered"
                >
                  <p className="text-sm">Write a review</p>
                </Button>
                {/* <Button
                  color="primary"
                  size="sm"
                  startContent={<VideoIcon width={18} />}
                >
                  Join
                </Button> */}
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}

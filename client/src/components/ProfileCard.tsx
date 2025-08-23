import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

import { formatTo12HourWithDate } from "@/utils/date";

interface ProfileCardProps {
  email: string;
  name: string;
  image?: string;
  lastLogin?: Date;
}

export default function ProfileCard({
  email,
  name,
  lastLogin,
  image,
}: ProfileCardProps) {
  return (
    <Card
      className="bg-background border border-default-200"
      radius="sm"
      shadow="sm"
    >
      <CardHeader>
        <User
          avatarProps={{
            size: "lg",
            radius: "sm",
            src: image,
          }}
          classNames={{
            name: "text-xl font-semibold capitalize",
          }}
          description={email}
          name={name}
        />
      </CardHeader>
      <Divider className="" orientation="horizontal" />
      <CardBody className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          <p>Account Status</p>
          <Chip className="text-xs" color="success" variant="flat">
            Active
          </Chip>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          <p>Last Login</p>
          <p>{lastLogin && formatTo12HourWithDate(new Date(lastLogin))}</p>
        </div>
      </CardBody>
    </Card>
  );
}

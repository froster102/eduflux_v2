import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

interface ProfileCardProps {
  email: string;
  name: string;
  accountStatus: boolean;
  lastLogin: string;
  id?: string;
}

export default function ProfileCard({
  email,
  name,
  accountStatus,
  lastLogin,
  id,
}: ProfileCardProps) {
  return (
    <Card className="bg-background " radius="sm" shadow="sm">
      <CardHeader>
        <User
          avatarProps={{
            size: "lg",
            radius: "sm",
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
          <Chip color="success" variant="flat">
            {accountStatus ? "Active" : "Blocked"}
          </Chip>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          <p>Last Login</p>
          <p>{lastLogin}</p>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          <p>Id</p>
          <p>{id}</p>
        </div>
      </CardBody>
    </Card>
  );
}

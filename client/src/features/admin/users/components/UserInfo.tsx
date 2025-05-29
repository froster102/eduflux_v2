import { Chip } from "@heroui/chip";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full justify-between">
        <p>ID</p>
        <p className="capitalize">
          {user.student ? user.student.id : user.tutor?.id}
        </p>
      </div>
      <div className="flex w-full justify-between">
        <p>First Name</p>
        <p className="capitalize">{user.firstName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Last Name</p>
        <p className="capitalize">{user.lastName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Contact Number</p>
        <p className="capitalize">{user.contactNumber}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Email</p>
        <p className="">{user.email}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Status</p>
        <Chip color={user.isActive ? "success" : "warning"} variant="flat">
          {user.isActive ? "Active" : "Blocked"}
        </Chip>
      </div>
    </div>
  );
}

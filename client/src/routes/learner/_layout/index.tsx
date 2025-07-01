import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";

import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/auth-store";
import RoleSwitcher from "@/components/RoleSwitcher";

export const Route = createFileRoute("/learner/_layout/")({
  component: Layout,
});

function Layout() {
  const { user } = useAuthStore();

  const navItems = [
    {
      path: "/",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    {
      path: "/courses",
      icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
      label: "Courses",
    },
    ...(user?.roles.includes("INSTRUCTOR")
      ? [
          {
            path: "/instructor",
            icon: (
              <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />
            ),
            label: "Instructor",
          },
        ]
      : []),
    {
      path: "/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/chat-bot",
      icon: <Icon icon="solar:chat-round-line-line-duotone" width={24} />,
      label: "Assistance",
    },
    {
      path: "/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  const topContent = (
    <>
      <div className="flex justify-between w-full px-2">
        <User className="text-default-500" name={user && user.name} />
        {/* <Notifications /> */}
      </div>
      <RoleSwitcher />
    </>
  );

  const bottomContent = <></>;

  return (
    <div className="p-0 lg:p-4 h-full">
      <div className="lg:flex gap-4 w-full h-full">
        <Sidebar
          bottomContent={bottomContent}
          navItems={navItems}
          topContent={topContent}
        />
        <div className="pt-16 lg:pt-0 w-full h-full">
          <Card className="dark:bg-secondary-700 bg-secondary-500 w-full h-full">
            <CardBody>
              <Outlet />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

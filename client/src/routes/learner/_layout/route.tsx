import { Icon } from "@iconify/react/dist/iconify.js";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User } from "@heroui/user";

import { useAuthStore } from "@/store/auth-store";
import RoleSwitcher from "@/components/RoleSwitcher";
import DefaultLayout from "@/components/DefaultLayout";

export const Route = createFileRoute("/learner/_layout")({
  component: Layout,
});

function Layout() {
  const { user } = useAuthStore();

  const topContent = (
    <>
      <div className="flex justify-between w-full px-2">
        <User className="text-default-500" name={user && user.name} />
        {/* <Notifications /> */}
      </div>
      <RoleSwitcher />
    </>
  );

  const navItems = [
    {
      path: "/learner",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    {
      path: "/learner/courses",
      icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
      label: "Courses",
    },
    {
      path: "/learner/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/instructor/messages",
      icon: <Icon icon="solar:chat-round-line-line-duotone" width={24} />,
      label: "Messages",
    },
    {
      path: "/instructor/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  return (
    <>
      <DefaultLayout navItems={navItems} topContent={topContent}>
        <Outlet />
      </DefaultLayout>
    </>
  );
}

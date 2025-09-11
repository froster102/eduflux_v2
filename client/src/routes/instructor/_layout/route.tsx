import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User } from "@heroui/user";

import { useAuthStore } from "@/store/auth-store";
import RoleSwitcher from "@/features/instructor/components/RoleSwitcher";
import HomeIcon from "@/components/icons/HomeIcon";
import CourseIcon from "@/components/icons/CourseIcon";
import SessionIcon from "@/components/icons/SessionIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import DefaultLayout from "@/layout/DefaultLayout";

export const Route = createFileRoute("/instructor/_layout")({
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
      path: "/instructor",
      icon: <HomeIcon width={24} />,
      label: "Home",
    },
    {
      path: "/instructor/courses",
      icon: <CourseIcon width={24} />,
      label: "Courses",
    },
    {
      path: "/instructor/sessions",
      icon: <SessionIcon width={24} />,
      label: "Sessions",
    },
    {
      path: "/instructor/chats",
      icon: <MessageIcon width={24} />,
      label: "Chats",
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

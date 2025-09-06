import { createFileRoute, Outlet } from "@tanstack/react-router";

import RoleSwitcher from "@/features/instructor/components/RoleSwitcher";
import HomeIcon from "@/components/icons/HomeIcon";
import CourseIcon from "@/components/icons/CourseIcon";
import SessionIcon from "@/components/icons/SessionIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import InstructorIcon from "@/components/icons/InstructorIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import DefaultLayout from "@/layout/DefaultLayout";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  const topContent = (
    <>
      {/* <div className="flex justify-between w-full px-2">
        <User className="text-default-500" name={user && user.name} />
        <Notifications />
      </div> */}
      <div className="flex justify-center w-full px-2">
        <p className="font-semibold text-2xl ">Eduflux</p>
      </div>
      <RoleSwitcher />
    </>
  );

  const navItems = [
    {
      path: "/home",
      icon: <HomeIcon width={24} />,
      label: "Home",
    },
    {
      path: "/courses",
      icon: <CourseIcon width={24} />,
      label: "Courses",
    },
    {
      path: "/sessions",
      icon: <SessionIcon width={24} />,
      label: "Sessions",
    },
    {
      path: "/instructors",
      icon: <InstructorIcon width={24} />,
      label: "Instructors",
    },
    {
      path: "/chats",
      icon: <MessageIcon width={24} />,
      label: "Chats",
    },
    {
      path: "/settings",
      icon: <SettingsIcon width={24} />,
      label: "Settings",
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

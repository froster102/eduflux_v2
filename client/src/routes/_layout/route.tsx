import { createFileRoute, Outlet } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import RoleSwitcher from "@/components/RoleSwitcher";
import DefaultLayout from "@/components/DefaultLayout";
import HomeIcon from "@/assets/icons/HomeIcon";
import CourseIcon from "@/assets/icons/CourseIcon";
import SessionIcon from "@/assets/icons/SessionIcon";
import MessageIcon from "@/assets/icons/MessageIcon";
import AccountIcon from "@/assets/icons/AccountIcon";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  const { user } = useAuthStore();

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
      path: "/messages",
      icon: <MessageIcon width={24} />,
      label: "Messages",
    },
    {
      path: "/account",
      icon: <AccountIcon width={24} />,
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

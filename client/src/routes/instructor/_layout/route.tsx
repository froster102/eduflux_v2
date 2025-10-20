import { createFileRoute, Outlet } from "@tanstack/react-router";

import HomeIcon from "@/components/icons/HomeIcon";
import CourseIcon from "@/components/icons/CourseIcon";
import SessionIcon from "@/components/icons/SessionIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import DefaultLayout from "@/layout/DefaultLayout";
import CashoutIcon from "@/components/icons/CashoutIcon";

export const Route = createFileRoute("/instructor/_layout")({
  component: Layout,
});

function Layout() {
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
    {
      path: "/instructor/payouts",
      icon: <CashoutIcon width={24} />,
      label: "Payouts",
    },
  ];

  return (
    <>
      <DefaultLayout navItems={navItems}>
        <Outlet />
      </DefaultLayout>
    </>
  );
}

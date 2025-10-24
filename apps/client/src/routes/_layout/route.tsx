import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import HomeIcon from "@/components/icons/HomeIcon";
import CourseIcon from "@/components/icons/CourseIcon";
import SessionIcon from "@/components/icons/SessionIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import InstructorIcon from "@/components/icons/InstructorIcon";
import DefaultLayout from "@/layout/DefaultLayout";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/shared/enums/Role";

export const Route = createFileRoute("/_layout")({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user;

    if (!user || !user.roles.includes(Role.LEARNER)) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Layout,
});

function Layout() {
  const navItems = [
    {
      path: `/home`,
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
  ];

  return (
    <>
      <DefaultLayout navItems={navItems}>
        <Outlet />
      </DefaultLayout>
    </>
  );
}

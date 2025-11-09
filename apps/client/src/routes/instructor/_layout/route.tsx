import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import HomeIcon from '@/components/icons/HomeIcon';
import CourseIcon from '@/components/icons/CourseIcon';
import SessionIcon from '@/components/icons/SessionIcon';
import MessageIcon from '@/components/icons/MessageIcon';
import DefaultLayout from '@/layout/DefaultLayout';
import CashoutIcon from '@/components/icons/CashoutIcon';
import { useAuthStore } from '@/store/auth-store';
import { Role } from '@/shared/enums/Role';

export const Route = createFileRoute('/instructor/_layout')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user;

    if (!user || !user.roles.includes(Role.INSTRUCTOR)) {
      throw redirect({
        to: '/auth/sign-in',
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
      path: '/instructor',
      icon: <HomeIcon width={24} />,
      label: 'Home',
    },
    {
      path: '/instructor/courses',
      icon: <CourseIcon width={24} />,
      label: 'Courses',
    },
    {
      path: '/instructor/sessions',
      icon: <SessionIcon width={24} />,
      label: 'Sessions',
    },
    {
      path: '/instructor/chats',
      icon: <MessageIcon width={24} />,
      label: 'Chats',
    },
    {
      path: '/instructor/payments',
      icon: <CashoutIcon width={24} />,
      label: 'Payments',
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

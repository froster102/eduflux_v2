import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import HomeIcon from '@/components/icons/HomeIcon';
import DefaultLayout from '@/layout/DefaultLayout';
import CashoutIcon from '@/components/icons/CashoutIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import InstructorIcon from '@/components/icons/InstructorIcon';
import { useAuthStore } from '@/store/auth-store';
import { Role } from '@/shared/enums/Role';

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user;

    if (!user || !user.roles.includes(Role.ADMIN)) {
      throw redirect({
        to: '/auth/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navItems = [
    {
      path: '/admin',
      icon: <HomeIcon width={24} />,
      label: 'Home',
    },
    {
      path: '/admin/users',
      icon: <UsersIcon width={24} />,
      label: 'Users',
    },
    {
      path: '/admin/instructors',
      icon: <InstructorIcon width={24} />,
      label: 'Instructors',
    },
    {
      path: '/admin/payments',
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

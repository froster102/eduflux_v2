import { createFileRoute, Outlet } from '@tanstack/react-router';

import HomeIcon from '@/components/icons/HomeIcon';
import DefaultLayout from '@/layout/DefaultLayout';
import CashoutIcon from '@/components/icons/CashoutIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import CourseIcon from '@/components/icons/CourseIcon';

export const Route = createFileRoute('/admin/_layout')({
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
      path: '/admin/courses',
      icon: <CourseIcon width={24} />,
      label: 'Courses',
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

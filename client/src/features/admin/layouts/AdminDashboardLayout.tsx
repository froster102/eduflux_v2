import { Card, CardBody } from "@heroui/card";
import { Outlet } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";

import Sidebar from "@/components/Sidebar";

export default function AdminDashboardLayout() {
  const navItems = [
    {
      path: "/admin",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    {
      path: "/admin/students",
      icon: <Icon icon="solar:user-id-outline" width={24} />,
      label: "Students",
    },
    {
      path: "/admin/tutors",
      icon: <Icon icon="solar:users-group-rounded-outline" width={24} />,
      label: "Tutors",
    },
    {
      path: "/admin/courses",
      icon: <Icon icon="solar:notebook-bookmark-linear" width={24} />,
      label: "Courses",
    },
    {
      path: "/admin/enrollments",
      icon: <Icon icon="solar:user-check-rounded-outline" width={24} />,
      label: "Enrollments",
    },
  ];

  return (
    <>
      <div className="p-0 lg:p-4 h-full">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar navItems={navItems} topContent={<div />} />
          <div className="pt-16 lg:pt-0 w-full h-full">
            <Card className="dark:bg-secondary-700 bg-secondary-500 w-full h-full">
              <CardBody className="scroll-smooth">
                <Outlet />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

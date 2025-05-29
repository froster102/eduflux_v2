import { Card, CardBody } from "@heroui/card";
import { Outlet } from "react-router";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import Sidebar from "@/components/Sidebar";

export default function InstructorDashboardLayout() {
  const topContent = (
    // <Card className="w-full bg-transparent" shadow="none">
    //   <User
    //     className="text-default-500"
    //     description="Product Designer"
    //     name="Jane Doe"
    //   />
    // </Card>
    <></>
  );

  const navItems = [
    {
      path: "/instructor",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    // {
    //   path: "/instructor/courses",
    //   icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
    //   label: "Courses",
    // },
    {
      path: "/instructor/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/instructor/notes",
      icon: <Icon icon="solar:notebook-line-duotone" width={24} />,
      label: "Notes",
    },
    {
      path: "/instructor/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  return (
    <>
      <div className="p-0 lg:p-4 h-full">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar navItems={navItems} topContent={topContent} />
          <div className="pt-16 lg:pt-0 w-full h-full">
            <Card className="dark:bg-secondary-700 bg-secondary-500 w-full h-full">
              <CardBody>
                <Outlet />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import React from "react";
import { User } from "@heroui/user";

import Sidebar from "@/components/Sidebar";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useAuthStore } from "@/store/auth-store";
import RoleSwitcher from "@/components/RoleSwitcher";

export const Route = createFileRoute("/instructor/_layout")({
  component: Layout,
});

function Layout() {
  const { user } = useAuthStore();
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);

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
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    {
      path: "/instructor/courses",
      icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
      label: "Courses",
    },
    {
      path: "/instructor/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/instructor/messages",
      icon: <Icon icon="solar:chat-round-line-line-duotone" width={24} />,
      label: "Messages",
    },
    {
      path: "/instructor/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  return (
    <>
      <div className="p-4 lg:p-2 h-full">
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
      <ConfirmationModal
        cancelText="No cancel"
        confirmText="Yes continue"
        isOpen={openConfirmationModal}
        message="Currently you are not an instructor,By confirming your account will be added with instructor access, you'll be able to create and publish courses, share your expertise with others.
              Your account will have access to instructor tools and dashboards.
              Are you sure you want to continue"
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={() => {
          setOpenConfirmationModal(false);
        }}
      />
    </>
  );
}

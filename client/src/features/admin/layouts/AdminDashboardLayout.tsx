import { Card, CardBody, CardHeader } from "@heroui/card";
import { Outlet, useNavigate } from "react-router";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import { useLogoutUserMutaion } from "@/hooks/mutations";
import Sidebar from "@/components/Sidebar";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logoutUserMutation = useLogoutUserMutaion(navigate);

  function handleLogout() {
    logoutUserMutation.mutate();
    setOpenLogoutConfirmation(false);
  }

  const bottomContent = (
    <>
      <Card
        isPressable
        className={`text-base font-medium transition-colors text-default-600 bg-transparent hover:bg-secondary-600 w-full`}
        shadow="none"
        onPress={() => setOpenLogoutConfirmation(true)}
      >
        <CardHeader className="flex gap-2 text-nowrap">
          <Icon icon="solar:minus-circle-linear" width={24} />
          Logout
        </CardHeader>
      </Card>
    </>
  );

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
    // {
    //   path: "/admin/sessions",
    //   icon: <Icon icon="solar:notebook-bookmark-linear" width={24} />,
    //   label: "Sessions",
    // },
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
          <Sidebar
            bottomContent={bottomContent}
            navItems={navItems}
            topContent={<div />}
          />
          <div className="pt-16 lg:pt-0 w-full h-full">
            <Card className="dark:bg-secondary-700 bg-secondary-500 w-full h-full">
              <CardBody className="scroll-smooth">
                <Outlet />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <ConfirmationModal
        confirmText="Logout"
        isOpen={openLogoutConfirmation}
        message="Are you sure that you want to logout"
        onClose={() => setOpenLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

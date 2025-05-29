import { Card, CardBody, CardHeader } from "@heroui/card";
import { Outlet, useNavigate } from "react-router";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

import Sidebar from "@/components/Sidebar";
import { useLogoutUserMutaion } from "@/hooks/mutations";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logoutUserMutation = useLogoutUserMutaion(navigate);

  function handleLogout() {
    logoutUserMutation.mutate();
    setOpenLogoutConfirmation(false);
  }

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
      path: "/tutor",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    // {
    //   path: "/tutor/courses",
    //   icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
    //   label: "Courses",
    // },
    {
      path: "/tutor/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/tutor/notes",
      icon: <Icon icon="solar:notebook-line-duotone" width={24} />,
      label: "Notes",
    },
    {
      path: "/tutor/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  const bottomDropDown = (
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
  );

  return (
    <>
      <div className="p-0 lg:p-4 h-full">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar
            bottomContent={bottomDropDown}
            navItems={navItems}
            topContent={topContent}
          />
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
        confirmText="Logout"
        isOpen={openLogoutConfirmation}
        message="Are you sure that you want to logout"
        onClose={() => setOpenLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

import { Card, CardBody } from "@heroui/card";
import { Outlet, useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { User } from "@heroui/user";
import React from "react";
import { Select, SelectItem } from "@heroui/select";

import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/store/auth-store";
import ConfirmationModal from "@/components/ConfirmationModal";

export const SelectorIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M8 9l4 -4l4 4" />
      <path d="M16 15l-4 4l-4 -4" />
    </svg>
  );
};

export default function StudentDashboardLayout() {
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/",
      icon: <Icon icon="solar:home-2-outline" width={24} />,
      label: "Home",
    },
    {
      path: "/courses",
      icon: <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />,
      label: "Courses",
    },
    ...(user?.roles.includes("INSTRUCTOR")
      ? [
          {
            path: "/instructor",
            icon: (
              <Icon icon="solar:notebook-bookmark-line-duotone" width={24} />
            ),
            label: "Instructor",
          },
        ]
      : []),
    {
      path: "/sessions",
      icon: <Icon icon="solar:calendar-outline" width={24} />,
      label: "Sessions",
    },
    {
      path: "/chat-bot",
      icon: <Icon icon="solar:chat-round-line-line-duotone" width={24} />,
      label: "Assistance",
    },
    {
      path: "/account",
      icon: <Icon icon="solar:user-circle-outline" width={24} />,
      label: "Account",
    },
  ];

  const roles: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    {
      key: "STUDENT",
      label: "Student",
      icon: <Icon icon="solar:user-broken" width={24} />,
    },
    {
      key: "INSTRUCTOR",
      label: "Instructor",
      icon: <Icon icon="solar:square-academic-cap-2-line-duotone" width={24} />,
    },
  ];

  function handleSelectionChange(value: string) {
    if (value === "INSTRUCTOR" && user) {
      if (!user.roles.includes("INSTRUCTOR")) {
        setOpenConfirmationModal(true);
      } else {
        navigate("/instructor/");
      }
    } else {
      navigate("/");
    }
  }

  const topContent = (
    <>
      <div className="flex justify-between w-full px-2">
        <User className="text-default-500" name={user && user.name} />
        {/* <Notifications /> */}
      </div>
      <Select
        aria-label="Select view"
        className="max-w-xs pt-4"
        defaultSelectedKeys={new Set(["STUDENT"])}
        items={roles}
        renderValue={(items) => {
          return items.map((item) => (
            <p key={item.key} className="flex gap-2">
              {item.data?.icon}
              {item.data?.label}
            </p>
          ));
        }}
        onSelectionChange={(value) => {
          handleSelectionChange(value.anchorKey as string);
        }}
      >
        {(role) => (
          <SelectItem key={role.key} textValue={role.label}>
            <p className="flex gap-2">
              {role.icon}
              {role.label}
            </p>
          </SelectItem>
        )}
      </Select>
    </>
  );

  const bottomContent = <></>;

  return (
    <>
      <div className="p-0 lg:p-4 h-full">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar
            bottomContent={bottomContent}
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

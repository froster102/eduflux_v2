import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Selection } from "@heroui/table";
import { useLocation, useNavigate } from "@tanstack/react-router";

import ConfirmationModal from "./ConfirmationModal";

import { useAuthStore } from "@/store/auth-store";
import { useBecomeAInstructor } from "@/features/learner/hooks/mutations";

export default function RoleSwitcher() {
  const location = useLocation();
  const currentRole = location.pathname.startsWith("/instructor")
    ? new Set(["INSTRUCTOR"])
    : new Set(["LEARNER"]);

  const [role, setRole] = React.useState<Selection>(currentRole);

  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const becomeAInstructor = useBecomeAInstructor();

  const roles: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    {
      key: "LEARNER",
      label: "Learner",
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
        setRole(new Set(["INSTRUCTOR"]));
        navigate({ to: "/instructor" });
      }
    } else if (value === "LEARNER") {
      setRole(new Set(["LEARNER"]));
      navigate({ to: "/learner" });
    }
  }

  return (
    <>
      <Select
        aria-label="Select view"
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
        className="max-w-xs pt-4"
        // defaultSelectedKeys={currentRole}
        selectedKeys={role}
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
      <ConfirmationModal
        cancelText="No cancel"
        confirmText="Yes continue"
        isOpen={openConfirmationModal}
        message="Currently you are not an instructor,By confirming your account will be added with instructor access, you'll be able to create and publish courses, share your expertise with others.
                  Your account will have access to instructor tools and dashboards.
                  Are you sure you want to continue"
        onClose={() => {
          setOpenConfirmationModal(false);
        }}
        onConfirm={() => {
          becomeAInstructor.mutate();
          setOpenConfirmationModal(false);
        }}
      />
    </>
  );
}

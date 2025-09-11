import { Select, SelectItem } from "@heroui/select";
import React from "react";
import { Selection } from "@heroui/table";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import { useBecomeAInstructor } from "@/features/instructor/hooks/useBecomeAInstructor";
import AcademicIcon from "@/components/icons/AcademicIcon";
import LearnerIcon from "@/components/icons/LearnerIcon";
import { useChatStore } from "@/store/useChatStore";

import ConfirmationModal from "../../../components/ConfirmationModal";

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
  const { resetSelectedChat } = useChatStore();

  const roles: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    {
      key: "LEARNER",
      label: "Learner",
      icon: <LearnerIcon width={24} />,
    },
    {
      key: "INSTRUCTOR",
      label: "Instructor",
      icon: <AcademicIcon width={24} />,
    },
  ];

  function handleSelectionChange(value: string) {
    if (value === "INSTRUCTOR" && user) {
      if (!user.roles.includes("INSTRUCTOR")) {
        setOpenConfirmationModal(true);
      } else {
        setRole(new Set(["INSTRUCTOR"]));
        resetSelectedChat();
        navigate({ to: "/instructor" });
      }
    } else if (value === "LEARNER") {
      setRole(new Set(["LEARNER"]));
      resetSelectedChat();
      navigate({ to: "/home" });
    }
  }

  return (
    <>
      <Select
        aria-label="Select view"
        className="max-w-xs pt-4"
        items={roles}
        renderValue={(items) => {
          return items.map((item) => (
            <p key={item.key} className="flex gap-2">
              {item.data?.icon}
              {item.data?.label}
            </p>
          ));
        }}
        selectedKeys={role}
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
      <ConfirmationModal
        cancelText="No cancel"
        confirmText="Yes continue"
        isOpen={openConfirmationModal}
        message="Ready to share your expertise? By confirming, you’ll gain instructor access to create and sell courses, offer paid video mentorship sessions, and engage with students through real-time messaging. Unlock powerful tools and dashboards to manage your content and earnings. Are you ready to inspire learners and grow your impact?"
        title="Become a Instructor"
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

import React from "react";
import { useDisclosure } from "@heroui/modal";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function DefaultLayout({
  navItems,
  children,
  topContent,
}: {
  children: React.ReactNode;
  navItems: {
    path: string;
    icon: JSX.Element;
    label: string;
  }[];
  topContent: React.ReactNode;
}) {
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="p-4 lg:p-6 h-dvh">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar
            isOpen={isOpen}
            navItems={navItems}
            topContent={topContent}
            onOpenChange={onOpenChange}
          />
          <div className="flex flex-col w-full h-full flex-1 overflow-hidden">
            <Header onOpenSidebar={onOpen} />
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
              <div className="h-full pt-4">{children}</div>
            </div>
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

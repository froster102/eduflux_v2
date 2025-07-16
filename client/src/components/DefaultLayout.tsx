import React from "react";

import ConfirmationModal from "./ConfirmationModal";
import Sidebar from "./Sidebar";

import Header from "@/features/components/Header";

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

  return (
    <>
      <div className="p-4 lg:p-6 h-dvh">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar navItems={navItems} topContent={topContent} />
          <div className="pt-16 lg:pt-0 w-full h-full flex-1 overflow-y-auto scrollbar-hide">
            <Header />
            <div className="pt-10 h-full">{children}</div>
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

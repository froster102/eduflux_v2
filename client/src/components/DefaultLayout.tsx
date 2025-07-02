import React from "react";
import { Card, CardBody } from "@heroui/card";

import ConfirmationModal from "./ConfirmationModal";
import Sidebar from "./Sidebar";

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
      <div className="p-4 lg:p-2 h-full">
        <div className="lg:flex gap-4 w-full h-full">
          <Sidebar navItems={navItems} topContent={topContent} />
          <div className="pt-16 lg:pt-0 w-full h-full">
            <Card className="dark:bg-secondary-700 bg-secondary-500 w-full h-full">
              <CardBody>{children}</CardBody>
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

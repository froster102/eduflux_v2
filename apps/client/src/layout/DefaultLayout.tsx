import React from 'react';
import { useDisclosure } from '@heroui/modal';

import Header from '@/components/Header';
import ConfirmationModal from '@/components/ConfirmationModal';
import Navbar from '@/components/Navabar';

export default function DefaultLayout({
  navItems,
  children,
}: {
  children: React.ReactNode;
  navItems: {
    path: string;
    icon: JSX.Element;
    label: string;
  }[];
}) {
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const { onOpen } = useDisclosure();

  return (
    <>
      <div className="pt-4 h-dvh flex flex-col items-center gap-4 overflow-hidden">
        <div className="container flex flex-col gap-4 px-4 sticky top-0 z-50 bg-background pb-2">
          <Header onOpenSidebar={onOpen} />
          <Navbar navItems={navItems} />
        </div>
        <div className="flex flex-col gap-4 w-full h-full container flex-1 min-h-0">
          <div className="flex flex-col w-full h-full flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
              <div className="h-full px-4 pb-4">{children}</div>
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

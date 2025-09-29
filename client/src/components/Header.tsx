import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import React from "react";

import { useAuthStore } from "@/store/auth-store";
import { IMAGE_BASE_URL } from "@/config/image";
import MenuIcon from "@/components/icons/MenuIcon";
// eslint-disable-next-line boundaries/element-types
import Notifications from "@/features/notification/components/Notifications";
import { SearchIcon } from "@/components/Icons";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useLogout } from "@/hooks/useLogout";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const { user } = useAuthStore();

  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logout = useLogout();

  async function handleLogout() {
    logout.mutate();
    setOpenLogoutConfirmation(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Button
                isIconOnly
                className="p-0 bg-transparent text-white"
                color="primary"
                radius="full"
                onPress={onOpenSidebar}
              >
                <MenuIcon />
              </Button>
            </div>
            <p className="lg:p-0 text-2xl font-semibold capitalize">Eduflux</p>
          </div>
          <Input
            className="hidden max-w-md"
            placeholder="Search courses"
            size="md"
            startContent={<SearchIcon />}
            variant="faded"
          />
          <div className="flex gap-4 items-center justify-center">
            <ThemeSwitcher className="hidden sm:block bg-transparent" />
            <Notifications />
            <User
              avatarProps={{
                size: "md",
                src: `${IMAGE_BASE_URL}${user?.image ?? undefined}`,
              }}
              className="hidden sm:flex text-default-500 text-sm"
              classNames={{
                name: "text-sm text-black dark:text-white font-medium",
                description: "text-default-600",
              }}
              description={user && user.email}
              name={user && user.name}
            />
            <Avatar
              className="sm:hidden"
              src={`${IMAGE_BASE_URL}${user?.image ?? undefined}`}
            />
          </div>
        </div>
      </header>
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

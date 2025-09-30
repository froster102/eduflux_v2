import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import { IMAGE_BASE_URL } from "@/config/image";
import MenuIcon from "@/components/icons/MenuIcon";
// eslint-disable-next-line boundaries/element-types
import Notifications from "@/features/notification/components/Notifications";
import { SearchIcon } from "@/components/Icons";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useLogout } from "@/hooks/useLogout";
import RoleSwitcher from "@/components/RoleSwitcher";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logout = useLogout();

  const handleDropdownAction = (key: React.Key) => {
    const actionKey = key.toString();

    if (actionKey === "logout") {
      setOpenLogoutConfirmation(true);

      return;
    }

    let targetPath = "";

    switch (actionKey) {
      case "profile":
        targetPath = `/settings?tab=profile`;
        break;
      case "account":
        targetPath = `/settings?tab=account`;
        break;
      default:
        return;
    }

    navigate({ to: targetPath });
  };

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
            <div className="hidden sm:block">
              <RoleSwitcher />
            </div>
            <ThemeSwitcher className="hidden sm:flex justify-center items-center bg-transparent" />
            <Notifications />
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <User
                  avatarProps={{
                    size: "md",
                    className: "block",

                    src: `${IMAGE_BASE_URL}${user?.image ?? undefined}`,
                  }}
                  className="sm:flex text-default-500 text-sm"
                  classNames={{
                    name: "hidden sm:inline-flex text-sm text-black dark:text-white font-medium",
                    description: "hidden sm:inline-flex text-default-600",
                  }}
                  description={user && user.email}
                  name={user && user.name}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                onAction={handleDropdownAction}
              >
                <DropdownItem key="signedInAs" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="profile">Profile</DropdownItem>
                <DropdownItem key="account">Account</DropdownItem>
                <DropdownItem key="system" className="sm:hidden">
                  System
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={() => {
                    setOpenLogoutConfirmation(true);
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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

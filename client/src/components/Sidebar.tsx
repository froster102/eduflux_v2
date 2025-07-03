import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import React from "react";
import { useDisclosure } from "@heroui/modal";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Link } from "@tanstack/react-router";

import ConfirmationModal from "./ConfirmationModal";
import { ThemeSwitcher } from "./ThemeSwitcher";

import { useLogout } from "@/features/auth/hooks/mutations";
import MenuIcon from "@/assets/icons/MenuIcon";
import LogoutIcon from "@/assets/icons/LogoutIcon";

interface SidebarProps {
  topContent?: React.ReactNode;
  navItems: Array<{
    path: string;
    icon: JSX.Element;
    label: string;
  }>;
  bottomContent?: React.ReactNode;
}

export default function Sidebar({
  topContent,
  navItems,
  bottomContent,
}: SidebarProps) {
  const [selected, setSelected] = React.useState<string>("home");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logout = useLogout();

  async function handleLogout() {
    logout.mutate();
    setOpenLogoutConfirmation(false);
  }

  return (
    <>
      <Card className="hidden lg:flex max-w-52 w-full h-full dark:bg-secondary-700 bg-secondary-500">
        <CardHeader className="relative">
          <ThemeSwitcher className="absolute top-0 right-0 bg-transparent" />
          <div className="w-full">{topContent}</div>
        </CardHeader>
        <CardBody className="flex flex-col justify-center gap-4 overflow-hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item, i) => (
              <Link
                key={i}
                className="text-zinc-900"
                to={item.path}
                onClick={() => setSelected(item.label)}
              >
                <Card
                  className={`text-base font-medium transition-colors text-default-600  ${selected === item.label ? "bg-secondary-600" : "bg-transparent"} hover:bg-secondary-600`}
                  shadow="none"
                >
                  <CardHeader className="flex gap-2 text-nowrap">
                    {item.icon}
                    {item.label}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <div className="w-full">
            <div className="pt-4">
              {bottomContent}
              <Card
                isPressable
                className={`text-base font-medium transition-colors text-default-600 bg-transparent hover:bg-secondary-600 w-full`}
                shadow="none"
                onPress={() => setOpenLogoutConfirmation(true)}
              >
                <CardHeader className="flex gap-2 text-nowrap">
                  <LogoutIcon width={24} />
                  Logout
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="lg:hidden lg:px-4 fixed top-0 left-0 z-50 w-full py-2">
        <Card
          disableRipple
          isPressable
          className="w-full dark:bg-secondary-700 bg-secondary-500"
          onPress={onOpen}
        >
          <CardBody>
            <div className="flex">
              <MenuIcon width={24} />
              <p className="pl-2 capitalize">{selected}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Drawer
        backdrop="transparent"
        isOpen={isOpen}
        placement="left"
        size="xs"
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="dark:bg-secondary-700 bg-secondary-500">
          {(onClose) => (
            <>
              <DrawerHeader className="flex gap-1 relative">
                {/* <ThemeSwitcher className="absolute top-0 right-0 bg-transparent" /> */}
                <div className="w-full">{topContent}</div>
              </DrawerHeader>
              <DrawerBody className="flex flex-col justify-center">
                <div className="flex flex-col gap-4">
                  {navItems.map((item, i) => (
                    <Link
                      key={i}
                      className="text-zinc-900"
                      to={item.path}
                      onClick={() => {
                        setSelected(item.label);
                        onClose();
                      }}
                    >
                      <Card
                        className={`text-base font-medium transition-colors text-default-600  ${selected === item.label ? "bg-secondary-600" : "bg-transparent"} hover:bg-secondary-600`}
                        shadow="none"
                      >
                        <CardHeader className="flex gap-2 text-nowrap">
                          {item.icon}
                          {item.label}
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <div className="w-full">
                  <div className="pt-4">
                    {bottomContent}
                    <Card
                      isPressable
                      className={`text-base font-medium transition-colors text-default-600 bg-transparent hover:bg-secondary-600 w-full`}
                      shadow="none"
                      onPress={() => setOpenLogoutConfirmation(true)}
                    >
                      <CardHeader className="flex gap-2 text-nowrap">
                        <LogoutIcon width={24} />
                        Logout
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
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

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Link } from "@tanstack/react-router";

import LogoutIcon from "@/components/icons/LogoutIcon";
import { useLogout } from "@/hooks/useLogout";

import ConfirmationModal from "./ConfirmationModal";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface SidebarProps {
  topContent?: React.ReactNode;
  navItems: Array<{
    path: string;
    icon: JSX.Element;
    label: string;
  }>;
  bottomContent?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function Sidebar({
  topContent,
  navItems,
  bottomContent,
  isOpen,
  onOpenChange,
}: SidebarProps) {
  const [selected, setSelected] = React.useState<string>("home");

  const [openLogoutConfirmation, setOpenLogoutConfirmation] =
    React.useState(false);
  const logout = useLogout();

  async function handleLogout() {
    logout.mutate();
    setOpenLogoutConfirmation(false);
  }

  return (
    <>
      <Card className="hidden lg:flex max-w-52 w-full h-full bg-background text-white border border-default-200">
        <CardHeader className="relative">
          <ThemeSwitcher className="absolute top-0 right-0 bg-transparent" />
          <div className="w-full">{topContent}</div>
        </CardHeader>
        <CardBody className="flex flex-col justify-center gap-4 overflow-hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => setSelected(item.label)}
              >
                <Card
                  className={`text-base
                     font-medium transition-colors ${selected === item.label ? "bg-black text-white dark:!bg-primary dark:text-black" : "bg-transparent text-black dark:text-white"}
                     `}
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
                className={`text-base font-medium transition-colors text-default-600 bg-transparent hover:bg-primary/60 hover:text-black w-full`}
                shadow="none"
                onPress={() => setOpenLogoutConfirmation(true)}
              >
                <CardHeader className="flex gap-2 text-white">
                  <LogoutIcon width={24} />
                  Logout
                </CardHeader>
              </Card>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Drawer
        backdrop="transparent"
        classNames={{
          base: "m-2 rounded-medium",
        }}
        isOpen={isOpen}
        placement="left"
        size="xs"
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="bg-background border border-default-200">
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
                        className={`text-base
                     font-medium transition-colors ${selected === item.label ? "bg-black text-white dark:!bg-primary dark:text-black" : "bg-transparent text-black dark:text-white"}
                     `}
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

import { Card, CardHeader } from '@heroui/card';
import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@heroui/drawer';
import { Link } from '@tanstack/react-router';

interface SidebarProps {
  navItems: Array<{
    path: string;
    icon: JSX.Element;
    label: string;
  }>;
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function Sidebar({
  navItems,
  isOpen,
  onOpenChange,
}: SidebarProps) {
  const [selected, setSelected] = React.useState<string>('home');

  // const [openLogoutConfirmation, setOpenLogoutConfirmation] =
  //   React.useState(false);
  // const logout = useLogout();

  // async function handleLogout() {
  //   logout.mutate();
  //   setOpenLogoutConfirmation(false);
  // }

  return (
    <>
      <Drawer
        backdrop="transparent"
        classNames={{
          base: 'm-2 rounded-medium',
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
                     font-medium transition-colors ${selected === item.label ? 'bg-black text-white dark:!bg-primary dark:text-black' : 'bg-transparent text-black dark:text-white'}
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
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

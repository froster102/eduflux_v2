import { Tab, Tabs } from "@heroui/tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import React from "react";

interface NavabarProps {
  navItems: {
    path: string;
    icon: React.ReactNode;
    label: string;
  }[];
}

export default function Navbar({ navItems }: NavabarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeRouteKey = React.useMemo(() => {
    return (
      navItems.find((item) => item.path.startsWith(location.pathname))?.path ||
      ""
    );
  }, [location.pathname, navItems]);

  const handleSelectionChange = React.useCallback(
    (key: React.Key) => {
      const targetPath = key.toString();

      navigate({
        to: targetPath,
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <nav>
      <Tabs
        aria-label="Navigation Items"
        className="w-full"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-default-500 border-divider",
          cursor: "w-full",
          tab: "max-w-fit px-0 h-14",
          tabContent: "group-data-[selected=true]:text-default-500",
        }}
        color="primary"
        selectedKey={activeRouteKey}
        variant="underlined"
        onSelectionChange={handleSelectionChange}
      >
        {navItems.map((navItem) => (
          <Tab
            key={navItem.path}
            title={
              <div className="flex items-center px-2">
                <span className="font-medium">{navItem.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </nav>
  );
}

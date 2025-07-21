import { User } from "@heroui/user";
import { useLocation } from "@tanstack/react-router";
import { Button } from "@heroui/button";

import { useAuthStore } from "@/store/auth-store";
import { IMAGE_BASE_URL } from "@/config/image";
import Notifications from "@/components/Notifications";
import MenuIcon from "@/assets/icons/MenuIcon";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  const routeRoleSegment = location.pathname.split("/")[2];

  const header =
    routeRoleSegment === "instructor" || routeRoleSegment === "admin"
      ? location.pathname.split("/")[2]
      : location.pathname.split("/")[1];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Button
              isIconOnly
              color="primary"
              radius="full"
              onPress={onOpenSidebar}
            >
              <MenuIcon />
            </Button>
          </div>
          <p className="lg:p-0 text-2xl font-semibold capitalize">{header}</p>
        </div>
        {/* <div>
          <Input
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "!bg-primary-500/10",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Search courses"
            size="md"
            startContent={<SearchIcon />}
          />
        </div> */}
        <div className="flex gap-2 items-center">
          <div className="hidden md:block">
            <User
              avatarProps={{
                src: `${IMAGE_BASE_URL}${user?.image ?? undefined}`,
              }}
              className="text-default-500"
              classNames={{
                name: "text-lg text-black dark:text-white font-medium",
                description: "text-default-600",
              }}
              description={user && user.email}
              name={user && user.name}
            />
          </div>
          <Notifications />
        </div>
      </div>
    </header>
  );
}

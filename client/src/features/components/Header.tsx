import { Input } from "@heroui/input";
import { User } from "@heroui/user";
import { useLocation } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import { SearchIcon } from "@/components/Icons";

export default function Header() {
  const { user } = useAuthStore();
  const location = useLocation();

  const path = location.pathname.split("/")[2] || "home";

  return (
    <header className="flex justify-between items-center">
      <div>
        <p className="text-2xl font-semibold capitalize">{path}</p>
      </div>
      <div>
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
      </div>
      <div>
        <User
          className="text-default-500"
          classNames={{
            name: "text-lg text-black dark:text-white font-medium",
            description: "text-default-600",
          }}
          description={user && user.email}
          name={user && user.name}
        />
      </div>
    </header>
  );
}

import { Spinner } from "@heroui/spinner";

import { ThemeSwitcher } from "./ThemeSwitcher";

// import { ThemeSwitch } from "./theme-switch";

export default function ScreenLoader() {
  return (
    <div className=" flex justify-center h-full w-full overflow-hidden">
      <div className="hidden">
        <ThemeSwitcher />
      </div>
      <Spinner size="lg" variant="wave" />
    </div>
  );
}

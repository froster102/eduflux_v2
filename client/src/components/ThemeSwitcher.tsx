import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useTheme } from "@heroui/use-theme";

import SunIcon from "@/assets/icons/SunIcon";
import MoonIcon from "@/assets/icons/MoonIcon";

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      isIconOnly
      className={`${className}`}
      startContent={
        theme === "dark" ? (
          <Tooltip content="Light mode">
            <SunIcon width={20} />
          </Tooltip>
        ) : (
          <Tooltip closeDelay={50} content="Dark mode">
            <MoonIcon width={20} />
          </Tooltip>
        )
      }
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};

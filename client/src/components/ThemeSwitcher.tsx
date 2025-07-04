import { Button } from "@heroui/button";
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
        theme === "dark" ? <SunIcon width={20} /> : <MoonIcon width={20} />
      }
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};

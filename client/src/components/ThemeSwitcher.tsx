import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useTheme } from "@heroui/use-theme";
import { Icon } from "@iconify/react/dist/iconify.js";

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
            <Icon icon="solar:sun-bold" width={20} />
          </Tooltip>
        ) : (
          <Tooltip closeDelay={50} content="Dark mode">
            <Icon icon="solar:moon-bold" width={20} />
          </Tooltip>
        )
      }
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};

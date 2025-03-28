"use client";

import { Monitor, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@components/ui/button";
import { useCallback } from "react";
type ColorSchemes = string;
const colorSchemes: Array<ColorSchemes> = ["system", "light", "dark"];

function CurrentColorSchemeIcon({
  colorscheme,
}: {
  colorscheme: ColorSchemes;
}) {
  if (colorscheme === "system") return <Monitor />;
  return colorscheme === "light" ? <SunIcon /> : <MoonIcon />;
}

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const changeColorScheme = useCallback(
    (colorScheme: ColorSchemes) => {
      const currentColorSchemeIndex = colorSchemes.indexOf(colorScheme);
      setTheme(colorSchemes[currentColorSchemeIndex + 1] ?? "system");
    },
    [setTheme],
  );
  if (!theme) {
    return null;
  }

  return (
    <Button onClick={() => changeColorScheme(theme)}>
      <CurrentColorSchemeIcon colorscheme={theme} />
    </Button>
  );
}

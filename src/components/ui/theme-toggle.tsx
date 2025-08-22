"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themeOptions = [
  {
    name: "Light",
    Icon: Sun,
    value: "light",
  },
  {
    name: "Dark",
    Icon: Moon,
    value: "dark",
  },
  {
    name: "System",
    Icon: Monitor,
    value: "system",
  },
] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {resolvedTheme === "dark" ? <Moon /> : <Sun />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map(({ name, Icon, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "cursor-pointer focus:bg-primary focus:text-primary-foreground",
              theme === value && "bg-accent text-foreground"
            )}
          >
            <Icon className="size-4 focus:text-primary-foreground" />
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

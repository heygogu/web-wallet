"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, SwordsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch"; 

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; 

  return (
    <div className="flex justify-between">
      <div className="font-bold text-4xl flex gap-2 items-center">
        <SwordsIcon size={30} /> <h1>krollo</h1>
      </div>
      <div className="flex items-center gap-2">
        <SunIcon color={theme === "dark" ? "gray" : "black"} size={26} />
        <Switch size={"default"}
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <MoonIcon color={theme === "light" ? "gray" : "white"} size={26} />
      </div>
    </div>
  );
};

export default Header;

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="fixed right-4 bottom-4 z-[70] inline-flex items-center justify-center w-11 h-11 rounded-full border border-gray-300/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/85 text-slate-700 dark:text-slate-100 shadow-lg hover:scale-105 transition"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;

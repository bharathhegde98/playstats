import { useEffect, useState } from "react";

interface HeaderProps {
  showNav?: boolean;
}

export default function Header({ showNav = false }: HeaderProps) {
  const [dark, setDark] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = (): void => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/playstats.png"
              alt="PlayStats logo"
              className="h-12 w-auto"
            />
            <div>
              <div className="text-[20px] font-semibold">
                <span className="text-gray-900 dark:text-white">Play</span>
                <span className="logo-gradient-text">Stats</span>
                <sup className="relative text-[9px] -top-[1em] text-gray-900 dark:text-white">
                  TM
                </sup>
              </div>
              <div className="text-[13px] italic text-gray-600 dark:text-gray-400">
                Every Match. Every Stat.
              </div>
            </div>
          </div>

          {/* Navigation */}
          {showNav && (
            <nav className="hidden md:flex items-center gap-8 font-medium">
              {["Matches", "Sports", "Teams", "Players"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  {item}
                </a>
              ))}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Login - Secondary */}
            <button className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-md transition">              
              Login
            </button>

            {/* Signup - Primary */}
            <button className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-md transition">
              Sign Up
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

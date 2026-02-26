import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function Header() {
  const [dark, setDark] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const { sportName } = useParams<{ sportName: string }>();

  /* ================= THEME ================= */

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = (): void => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  /* ================= MOBILE BEHAVIOR ================= */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  /* ================= LINKS ================= */

  const links = sportName
    ? [
        { label: "Live Matches", path: `/${sportName}/live` },
        ...(sportName !== "cricket"
          ? [{ label: "Cricket", path: "/cricket" }]
          : []),
        ...(sportName !== "volleyball"
          ? [{ label: "Volleyball", path: "/volleyball" }]
          : []),
        ...(sportName !== "football"
          ? [{ label: "Football", path: "/football" }]
          : []),
        { label: "Tournament Guide", path: `/${sportName}/guide` },
        { label: "Contact", path: "/contact" },
      ]
    : [
        { label: "Cricket", path: "/cricket" },
        { label: "Volleyball", path: "/volleyball" },
        { label: "Football", path: "/football" },
        { label: "Contact", path: "/contact" },
      ];

  /* ================= UI ================= */

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* ===== LOGO ===== */}
          <NavLink
            to="/"
            aria-label="Go to homepage"
            className="flex items-center gap-3"
          >
            <img
              src="/playstats.png"
              alt="PlayStats logo"
              className="h-10 w-auto"
            />
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Play<span className="logo-gradient-text">Stats</span>
              </div>
              <div className="text-xs italic text-gray-500 dark:text-gray-400">
                Every Match. Every Stat.
              </div>
            </div>
          </NavLink>

          {/* ===== RIGHT SECTION ===== */}
          <div className="flex items-center gap-6">

            {/* THEME TOGGLE (FIRST) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              aria-pressed={dark}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* DESKTOP NAV */}
            <nav
              className="hidden lg:block"
              aria-label="Primary Navigation"
            >
              <ul className="flex items-center gap-6 font-medium text-gray-700 dark:text-gray-300">
                {links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-emerald-500 font-semibold"
                          : "hover:text-emerald-500 transition"
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* HAMBURGER (Mobile Only) */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              ☰
            </button>

            {/* SIGNUP (ALWAYS LAST) */}
            <button
              className="hidden lg:block px-5 py-2 rounded-md bg-emerald-500 text-white font-medium hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              aria-label="Sign up for PlayStats"
            >
              Signup
            </button>

          </div>
        </div>
      </div>

      {/* ===== BACKDROP ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ===== MOBILE DRAWER (LEFT) ===== */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-950 shadow-xl transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src="/playstats.png"
              alt="PlayStats logo"
              className="h-10 w-auto"
            />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Play<span className="logo-gradient-text">Stats</span>
              </div>
              <div className="text-xs italic text-gray-500 dark:text-gray-400">
                Every Match. Every Stat.
              </div>
            </div>
          </div>

          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Drawer Links */}
        <div className="p-6">
          <ul className="space-y-6 font-medium text-gray-700 dark:text-gray-300">
            {links.map((link, index) => (
              <li
                key={link.path}
                className={`transform transition-all duration-500 ease-out ${
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <NavLink
                  to={link.path}
                  onClick={closeMobile}
                  className="block hover:text-emerald-500 transition"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Signup (Fade Up) */}
          <button
            className={`mt-8 w-full px-4 py-2 rounded-md bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-all duration-500 ease-out ${
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${links.length * 80 + 80}ms` }}
          >
            Signup
          </button>
        </div>
      </div>
    </header>
  );
}

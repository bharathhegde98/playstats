import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  /* ================= MOBILE ================= */

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
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3">
            <img src="/playstats.png" alt="PlayStats logo" className="h-10" />
            <span className="text-lg font-semibold">
              Play<span className="logo-gradient-text">Stats</span>
            </span>
          </NavLink>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-6 font-medium">
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

            {/* AUTH BUTTONS */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/app/dashboard")}
                  className="px-5 py-2 bg-emerald-500 text-white rounded-md"
                >
                  Open App
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 border rounded-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              ☰
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 lg:hidden" onClick={closeMobile} />
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-950 shadow-xl transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMobile}
              className="block hover:text-emerald-500"
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/app/dashboard")}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md"
              >
                Open App
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
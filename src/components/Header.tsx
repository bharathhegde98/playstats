import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 section-base border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/playstats.png" alt="PlayStats logo" className="h-10" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Play
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Stats
              </span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ) : isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full bg-emerald-500 text-white font-semibold flex items-center justify-center hover:bg-emerald-400 transition"
                  >
                    {getInitials()}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">

                      <Link
                        to="/app/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40"
            onClick={closeMobile}
          />
          <nav className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-950 shadow-xl p-6 space-y-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/app/dashboard"
                  onClick={closeMobile}
                  className="block px-4 py-2 bg-emerald-500 text-white rounded-md text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobile();
                  }}
                  className="block w-full px-4 py-2 border border-red-500 text-red-500 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block px-4 py-2 bg-emerald-500 text-white rounded-md text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobile}
                  className="block px-4 py-2 bg-emerald-500 text-white rounded-md text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
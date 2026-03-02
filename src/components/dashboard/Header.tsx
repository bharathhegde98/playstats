import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const getInitials = () => {
    if (!user?.fullName) return "U";

    return user.fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 
                 bg-gray-950/95 backdrop-blur 
                 border-b border-gray-800 
                 flex items-center justify-between 
                 px-6 z-50"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-1">

        {/* HAMBURGER */}
        <button
          onClick={onMenuClick}
          className="text-gray-300 hover:text-white transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* SEARCH BAR */}
        <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 w-full max-w-md">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tournaments, players, matches..."
            className="bg-transparent outline-none text-sm text-gray-200 w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATION */}
        <button className="relative text-gray-400 hover:text-white transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.405-1.405M19 13V8a7 7 0 10-14 0v5l-1.405 1.405M9 21h6" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        {/* AVATAR + DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full 
                           bg-emerald-500 
                           text-gray-950 
                           font-semibold 
                           flex items-center 
                           justify-center 
                           text-sm 
                           border border-gray-700"
              >
                {getInitials()}
              </div>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
              
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-sm font-medium text-gray-200">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition">
                Profile
              </button>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition">
                Settings
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
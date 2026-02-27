import { useAuth } from "../../contexts/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SideDrawer({ open, onClose }: Props) {
  const { user } = useAuth();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-gray-800 z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Close Button Only */}
        <div className="flex justify-end p-5">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition" aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* User Section */}
        <div className="px-6 pb-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-gray-950 font-bold text-lg">
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-4 text-sm text-gray-300">
          <NavItem label="Dashboard" />
          <NavItem label="My Tournaments" />
          <NavItem label="My Matches" />
          <NavItem label="Teams" />
          <NavItem label="Settings" />
        </nav>
      </div>
    </>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-emerald-400 cursor-pointer transition">
      {label}
    </div>
  );
}
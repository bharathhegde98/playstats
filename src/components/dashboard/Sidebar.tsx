import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Medal,
  BarChart3,
  PlusCircle,
  Bell,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";

type Props = {
  open: boolean;
};

export default function Sidebar({ open }: Props) {
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [matchesOpen, setMatchesOpen] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72
      bg-[#0f172a] 
      border-r border-gray-800
      transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 text-white text-lg font-semibold border-b border-gray-800">
        PlayStats
      </div>

      <nav className="px-4 py-6 space-y-6 text-sm">

        {/* MAIN */}
        <SectionTitle label="MAIN" />
        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem icon={<Medal size={18} />} label="Leaderboard" />

        {/* COMPETE */}
        <SectionTitle label="COMPETE" />

        <AccordionItem
          icon={<Trophy size={18} />}
          label="Tournaments"
          open={tournamentsOpen}
          onClick={() => setTournamentsOpen(!tournamentsOpen)}
        >
          <SubItem label="Cricket" />
          <SubItem label="Volleyball" />
          <SubItem label="Football" />
        </AccordionItem>

        <AccordionItem
          icon={<Trophy size={18} />}
          label="Matches"
          open={matchesOpen}
          onClick={() => setMatchesOpen(!matchesOpen)}
        >
          <SubItem label="Cricket" />
          <SubItem label="Volleyball" />
          <SubItem label="Football" />
        </AccordionItem>

        {/* ANALYTICS */}
        <SectionTitle label="ANALYTICS" />
        <NavItem icon={<BarChart3 size={18} />} label="Stats & Reports" />

        {/* MANAGE */}
        <SectionTitle label="MANAGE" />
        <NavItem icon={<PlusCircle size={18} />} label="Create" />
        <NavItem icon={<Bell size={18} />} label="Notifications" />
        <NavItem icon={<User size={18} />} label="Profile" />
        <NavItem icon={<Settings size={18} />} label="Settings" />

      </nav>
    </aside>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <p className="text-xs text-gray-500 uppercase tracking-wider px-3">
      {label}
    </p>
  );
}

function NavItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg 
                    text-gray-300 hover:bg-gray-800 hover:text-white 
                    cursor-pointer transition">
      {icon}
      {label}
    </div>
  );
}

function AccordionItem({
  icon,
  label,
  open,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        onClick={onClick}
        className="flex items-center justify-between px-3 py-2 rounded-lg 
                   text-gray-300 hover:bg-gray-800 hover:text-white 
                   cursor-pointer transition"
      >
        <div className="flex items-center gap-3">
          {icon}
          {label}
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="ml-8 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-800 
                    rounded-md cursor-pointer transition text-sm">
      {label}
    </div>
  );
}
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/dashboard/Header";
import SideDrawer from "../components/dashboard/SideDrawer";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <Header onMenuClick={() => setDrawerOpen(true)} />

      {/* SIDE DRAWER */}
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* PAGE CONTENT */}
      <main className="pt-16 pb-24 px-5">
        <Outlet />
      </main>
    </div>
  );
}
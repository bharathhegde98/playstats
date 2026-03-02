import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Area (moves right when sidebar opens) */}
      <div
        className={`flex flex-col h-full transition-all duration-300 
        ${sidebarOpen ? "ml-72" : "ml-0"}`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          {/* Dashboard content here */}
        </main>
      </div>
    </div>
  );
}
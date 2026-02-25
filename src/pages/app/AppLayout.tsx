import { Outlet, NavLink } from 'react-router-dom';

const tabs = [
  {
    to: '/app/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-400' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/app/create',
    label: 'Create',
    icon: (active: boolean) => (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-5 ${active ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' : 'bg-gradient-to-br from-emerald-600 to-cyan-600'}`}>
        <svg className="w-6 h-6 text-gray-950" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
  },
  {
    to: '/app/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-emerald-400' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-4 h-16 z-50">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                {tab.to !== '/app/create' && (
                  <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {tab.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

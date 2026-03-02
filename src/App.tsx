import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SportProvider, useSport } from "./contexts/SportContext";
import type { ReactNode } from "react";

import RootLayout from "./layouts/RootLayout";
import SportLayout from "./layouts/SportLayout";

// Public pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SportLive from "./pages/sport/SportLive";
import SportGuide from "./pages/sport/SportGuide";

// App pages
import Login from "./pages/app/Login";
import Signup from "./pages/app/Signup";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import CreateTournament from "./pages/app/CreateTournament";
import Profile from "./pages/app/Profile";
import JoinTournament from "./pages/app/JoinTournament";

/* ---------------- Protected Routes ---------------- */
type ProtectedProps = {
  	children: ReactNode;
};

function PrivateRoute({ children }: ProtectedProps) {
	const { isAuthenticated, isLoading } = useAuth();
	if (isLoading) return <div className="min-h-screen bg-gray-950" />;
	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return <>{children}</>;
}


/* ---------------- Routes ---------------- */

function AppRoutes() {
	return (
		<Routes>
			{/* Public Layout */}
			<Route element={<RootLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/contact" element={<Contact />} />

				{/* Dynamic Sport Routes */}
				<Route path="/:sportName" element={<SportLayout />}>
				<Route path="live" element={<SportLive />} />
				<Route path="guide" element={<SportGuide />} />
				</Route>
			</Route>

			{/* Auth Pages */}
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />

			{/* Main App (Protected + Sport Selected) */}
			<Route path="/app" element={
				<PrivateRoute>
					<AppLayout />
				</PrivateRoute>
			}>
				<Route index element={<Navigate to="/app/dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="create" element={<CreateTournament />} />
				<Route path="profile" element={<Profile />} />
			</Route>

			{/* Public Join */}
			<Route path="/join/:inviteCode" element={<JoinTournament />} />

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}


/* ---------------- App Wrapper ---------------- */

export default function App() {
	return (
		<AuthProvider>
			<SportProvider>
				<AppRoutes />
			</SportProvider>
		</AuthProvider>
	);
}
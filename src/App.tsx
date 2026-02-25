import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SportProvider, useSport } from './contexts/SportContext';

// Landing
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

// App pages
import Login from './pages/app/Login';
import Signup from './pages/app/Signup';
import SportSelect from './pages/app/SportSelect';
import AppLayout from './pages/app/AppLayout';
import Dashboard from './pages/app/Dashboard';
import CreateTournament from './pages/app/CreateTournament';
import Profile from './pages/app/Profile';
import JoinTournament from './pages/app/JoinTournament';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-gray-950" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function SportRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedSport } = useSport();
  if (isLoading) return <div className="min-h-screen bg-gray-950" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!selectedSport) return <Navigate to="/select-sport" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing — with Header + Footer */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
              <Home />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Auth pages — no chrome */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Sport selection — requires auth */}
      <Route
        path="/select-sport"
        element={
          <PrivateRoute>
            <SportSelect />
          </PrivateRoute>
        }
      />

      {/* Main app — requires auth + sport */}
      <Route
        path="/app"
        element={
          <SportRoute>
            <AppLayout />
          </SportRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create" element={<CreateTournament />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Public join link */}
      <Route path="/join/:inviteCode" element={<JoinTournament />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SportProvider>
        <AppRoutes />
      </SportProvider>
    </AuthProvider>
  );
}

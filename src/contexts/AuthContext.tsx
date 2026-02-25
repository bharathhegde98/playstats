import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, type User, type SignUpData } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ps_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('ps_token');
        localStorage.removeItem('ps_refresh_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.signIn(email, password);
    localStorage.setItem('ps_token', result.accessToken);
    if (result.refreshToken) localStorage.setItem('ps_refresh_token', result.refreshToken);
    setUser(result.user);
  };

  const signup = async (data: SignUpData) => {
    const result = await authApi.signUp(data);
    localStorage.setItem('ps_token', result.accessToken);
    if (result.refreshToken) localStorage.setItem('ps_refresh_token', result.refreshToken);
    setUser(result.user);
  };

  const logout = () => {
    authApi.signOut().catch(() => {});
    localStorage.removeItem('ps_token');
    localStorage.removeItem('ps_refresh_token');
    localStorage.removeItem('ps_sport');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

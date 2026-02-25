import { createContext, useContext, useState, ReactNode } from 'react';
import type { Sport } from '../lib/api';

interface SportContextType {
  selectedSport: Sport | null;
  setSport: (sport: Sport) => void;
}

const SportContext = createContext<SportContextType | null>(null);

export function SportProvider({ children }: { children: ReactNode }) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(
    () => (localStorage.getItem('ps_sport') as Sport) || null
  );

  const setSport = (sport: Sport) => {
    localStorage.setItem('ps_sport', sport);
    setSelectedSport(sport);
  };

  return (
    <SportContext.Provider value={{ selectedSport, setSport }}>
      {children}
    </SportContext.Provider>
  );
}

export function useSport() {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error('useSport must be used within SportProvider');
  return ctx;
}

import { useNavigate } from 'react-router-dom';
import { useSport } from '../../contexts/SportContext';
import type { Sport } from '../../lib/api';

const SPORTS: { id: Sport; label: string; emoji: string; desc: string; color: string }[] = [
  {
    id: 'cricket',
    label: 'Cricket',
    emoji: '🏏',
    desc: 'Tournaments, matches & live scores',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
  },
  {
    id: 'football',
    label: 'Football',
    emoji: '⚽',
    desc: 'Leagues, cups & real-time updates',
    color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
  },
  {
    id: 'volleyball',
    label: 'Volleyball',
    emoji: '🏐',
    desc: 'Sets, points & tournament brackets',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
  },
];

export default function SportSelect() {
  const { setSport } = useSport();
  const navigate = useNavigate();
  const intended = localStorage.getItem('ps_intended_sport') as Sport | null;

  const handleSelect = (sport: Sport) => {
    localStorage.removeItem('ps_intended_sport');
    setSport(sport);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-3xl font-bold logo-gradient-text">PlayStats</span>
          <h2 className="text-white text-xl font-semibold mt-4">Choose your sport</h2>
          <p className="text-gray-400 text-sm mt-1">
            Your dashboard will focus on this sport
          </p>
        </div>

        <div className="space-y-3">
          {SPORTS.map((sport) => (
            <button
              key={sport.id}
              onClick={() => handleSelect(sport.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${sport.color} border text-left transition-transform active:scale-95 ${intended === sport.id ? 'ring-2 ring-emerald-500' : ''}`}
            >
              <span className="text-4xl">{sport.emoji}</span>
              <div>
                <p className="text-white font-semibold">{sport.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{sport.desc}</p>
              </div>
              <span className="ml-auto text-gray-500">›</span>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          You can switch your sport anytime from the dashboard
        </p>
      </div>
    </div>
  );
}

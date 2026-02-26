import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSport } from '../../contexts/SportContext';
import { tournamentsApi, type Tournament, type Sport } from '../../lib/api';

const SPORT_META: Record<Sport, { emoji: string; label: string }> = {
  cricket: { emoji: '🏏', label: 'Cricket' },
  football: { emoji: '⚽', label: 'Football' },
  volleyball: { emoji: '🏐', label: 'Volleyball' },
};

const STATUS_BADGE: Record<string, string> = {
  ongoing: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  completed: 'bg-gray-700/40 text-gray-500 border-gray-600/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function TournamentCard({ t }: { t: Tournament }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/app/dashboard`)}
      className="w-full text-left bg-gray-900 border border-gray-800 rounded-2xl p-4 active:scale-95 transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{t.name}</p>
          {t.description && (
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{t.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[t.status] || STATUS_BADGE.draft}`}>
          {t.status}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3">
        {t.city && (
          <span className="text-gray-500 text-xs flex items-center gap-1">
            📍 {t.city}
          </span>
        )}
        <span className="text-gray-500 text-xs flex items-center gap-1">
          👥 {t.currentTeams}/{t.maxTeams} teams
        </span>
        <span className="text-gray-500 text-xs">
          {new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-4xl mb-3">🏆</p>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

export default function Dashboard() {
  const { selectedSport, setSport } = useSport();
  const [upcoming, setUpcoming] = useState<Tournament[]>([]);
  const [live, setLive] = useState<Tournament[]>([]);
  const [history, setHistory] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sport = selectedSport!;
  const meta = SPORT_META[sport];

  const SPORTS: Sport[] = ['cricket', 'football', 'volleyball'];

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      tournamentsApi.list({ sport, status: 'draft' }),
      tournamentsApi.list({ sport, status: 'open' }),
      tournamentsApi.list({ sport, status: 'ongoing' }),
      tournamentsApi.list({ sport, status: 'completed' }),
    ])
      .then(([draftData, openData, liveData, historyData]) => {
        setUpcoming([...draftData, ...openData]);
        setLive(liveData);
        setHistory(historyData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sport]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-900 px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-500 text-xs">Currently viewing</p>
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
              {meta.emoji} {meta.label}
            </h1>
          </div>
          <span className="text-xs text-emerald-400 font-medium">PlayStats</span>
        </div>

        {/* Sport switcher */}
        <div className="flex gap-2">
          {SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                s === sport
                  ? 'bg-emerald-500 text-gray-950'
                  : 'bg-gray-900 text-gray-500 border border-gray-800'
              }`}
            >
              {SPORT_META[s].emoji} {SPORT_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5 space-y-8">
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Open & Upcoming */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                <h2 className="text-white font-semibold text-sm">Open & Upcoming</h2>
              </div>
              {upcoming.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.map((t) => <TournamentCard key={t.id} t={t} />)}
                </div>
              ) : (
                <EmptyState message="No upcoming tournaments" />
              )}
            </section>

            {/* Live Now */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <h2 className="text-white font-semibold text-sm">Live Now</h2>
              </div>
              {live.length > 0 ? (
                <div className="space-y-3">
                  {live.map((t) => <TournamentCard key={t.id} t={t} />)}
                </div>
              ) : (
                <EmptyState message="No live tournaments right now" />
              )}
            </section>

            {/* History */}
            <section>
              <h2 className="text-white font-semibold text-sm mb-3">History</h2>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((t) => <TournamentCard key={t.id} t={t} />)}
                </div>
              ) : (
                <EmptyState message="No completed tournaments yet" />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

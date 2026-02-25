import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tournamentsApi, type Tournament } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function JoinTournament() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!inviteCode) return;
    tournamentsApi.getByInviteCode(inviteCode)
      .then(setTournament)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [inviteCode]);

  const SPORT_EMOJI: Record<string, string> = {
    cricket: '🏏',
    football: '⚽',
    volleyball: '🏐',
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold logo-gradient-text">PlayStats</span>
          <p className="text-gray-400 text-sm mt-1">Tournament Invite</p>
        </div>

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse h-40" />
        )}

        {error && (
          <div className="text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white font-semibold">Tournament not found</p>
            <p className="text-gray-500 text-sm mt-1">This invite link may have expired</p>
            <Link to="/" className="mt-6 block text-emerald-400 text-sm">Back to home</Link>
          </div>
        )}

        {tournament && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-center mb-5">
              <span className="text-5xl">{SPORT_EMOJI[tournament.sportType]}</span>
              <h2 className="text-white text-lg font-bold mt-2">{tournament.name}</h2>
              {tournament.description && (
                <p className="text-gray-400 text-sm mt-1">{tournament.description}</p>
              )}
            </div>

            <div className="space-y-2 text-sm mb-5">
              {[
                { label: 'Sport', value: tournament.sportType },
                { label: 'Status', value: tournament.status },
                { label: 'Teams', value: `${tournament.currentTeams}/${tournament.maxTeams}` },
                tournament.city && { label: 'City', value: tournament.city },
                {
                  label: 'Starts',
                  value: new Date(tournament.startDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  }),
                },
              ].filter(Boolean).map((row: any) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-white font-medium capitalize">{row.value}</span>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app/dashboard')}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 text-sm"
              >
                View in App
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to={`/signup`}
                  className="block w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 text-sm text-center"
                >
                  Sign Up to Join
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-3 rounded-xl font-semibold border border-gray-700 text-gray-300 text-sm text-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

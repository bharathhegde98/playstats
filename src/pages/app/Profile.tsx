import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSport } from '../../contexts/SportContext';
import type { Sport } from '../../lib/api';

const SPORT_META: Record<Sport, { emoji: string; label: string }> = {
  cricket: { emoji: '🏏', label: 'Cricket' },
  badminton: { emoji: '🏸', label: 'Badminton' },
  volleyball: { emoji: '🏐', label: 'Volleyball' },
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { selectedSport, setSport } = useSport();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 border-b border-gray-900">
        <h1 className="text-white text-xl font-bold mb-5">Profile</h1>

        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-gray-950 font-bold text-xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">{user?.fullName}</p>
            {user?.username && <p className="text-gray-500 text-sm">@{user.username}</p>}
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Info */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
          {[
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phoneNumber },
            {
              label: 'Member since',
              value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—',
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-gray-500 text-sm">{row.label}</span>
              <span className="text-white text-sm font-medium">{row.value || '—'}</span>
            </div>
          ))}
        </section>

        {/* Sport preference */}
        <section>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 px-1">Sport Preference</p>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
            {(Object.keys(SPORT_META) as Sport[]).map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <span className="text-white text-sm">
                  {SPORT_META[s].emoji} {SPORT_META[s].label}
                </span>
                {selectedSport === s && (
                  <span className="text-emerald-400 text-xs font-medium">✓ Active</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-red-400 bg-red-400/10 border border-red-400/20"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

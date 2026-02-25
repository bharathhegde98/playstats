import { useState, FormEvent } from 'react';
import { useSport } from '../../contexts/SportContext';
import { tournamentsApi, type Tournament, type Sport } from '../../lib/api';

const SPORT_META: Record<Sport, { emoji: string; label: string }> = {
  cricket: { emoji: '🏏', label: 'Cricket' },
  football: { emoji: '⚽', label: 'Football' },
  volleyball: { emoji: '🏐', label: 'Volleyball' },
};

const DEFAULTS: Record<Sport, { min: number; max: number }> = {
  cricket: { min: 11, max: 15 },
  football: { min: 11, max: 18 },
  volleyball: { min: 6, max: 12 },
};

export default function CreateTournament() {
  const { selectedSport } = useSport();
  const sport = selectedSport!;
  const meta = SPORT_META[sport];
  const defaults = DEFAULTS[sport];

  const [form, setForm] = useState({
    name: '',
    description: '',
    sportType: sport,
    maxTeams: 8,
    minPlayersPerTeam: defaults.min,
    maxPlayersPerTeam: defaults.max,
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    country: 'India',
    allowPublicJoin: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<Tournament | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await tournamentsApi.create({
        ...form,
        sportType: sport,
        maxTeams: Number(form.maxTeams),
        minPlayersPerTeam: Number(form.minPlayersPerTeam),
        maxPlayersPerTeam: Number(form.maxPlayersPerTeam),
        endDate: form.endDate || undefined,
        venue: form.venue || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        description: form.description || undefined,
      });
      setCreated(result);
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const inviteUrl = created?.inviteCode
    ? `${window.location.origin}/join/${created.inviteCode}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (created) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white text-xl font-bold">{created.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Tournament created successfully</p>

          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-2">Share this invite link</p>
            <p className="text-emerald-400 text-sm font-mono break-all">{inviteUrl}</p>

            <button
              onClick={copyLink}
              className={`mt-3 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Invite Link'}
            </button>
          </div>

          <button
            onClick={() => { setCreated(null); setForm(f => ({ ...f, name: '', description: '' })); }}
            className="mt-4 text-gray-500 text-sm"
          >
            Create another tournament
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-900 px-5 pt-12 pb-4">
        <p className="text-gray-500 text-xs">New Tournament</p>
        <h1 className="text-white text-xl font-bold">
          {meta.emoji} {meta.label} Tournament
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5 pb-10">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Tournament Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Summer Cricket League 2025"
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of the tournament..."
            rows={2}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Start Date *</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={set('startDate')}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={set('endDate')}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Teams */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Max Teams</label>
          <select
            value={form.maxTeams}
            onChange={set('maxTeams')}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
          >
            {[2, 4, 8, 16, 32].map(n => (
              <option key={n} value={n}>{n} teams</option>
            ))}
          </select>
        </div>

        {/* Players per team */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Min Players/Team</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.minPlayersPerTeam}
              onChange={set('minPlayersPerTeam')}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Max Players/Team</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.maxPlayersPerTeam}
              onChange={set('maxPlayersPerTeam')}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Venue */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={set('venue')}
              placeholder="Ground name"
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">City</label>
            <input
              type="text"
              value={form.city}
              onChange={set('city')}
              placeholder="Mumbai"
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Public join toggle */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
          <div>
            <p className="text-white text-sm font-medium">Public Join</p>
            <p className="text-gray-500 text-xs">Anyone with the link can request to join</p>
          </div>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, allowPublicJoin: !f.allowPublicJoin }))}
            className={`w-12 h-6 rounded-full transition-colors ${form.allowPublicJoin ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.allowPublicJoin ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </div>
  );
}

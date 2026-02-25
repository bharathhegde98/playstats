import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../lib/api';

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [field]: '' }));
  };

  // Auto-format phone: if user types 10 digits without +, prepend +91
  const handlePhoneBlur = () => {
    const raw = form.phoneNumber.trim();
    if (raw && !raw.startsWith('+')) {
      setForm((f) => ({ ...f, phoneNumber: '+91' + raw }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    setLoading(true);
    try {
      await signup(form);
      // navigation handled by useEffect above
    } catch (err: any) {
      if (err instanceof ApiError && err.details?.length) {
        // Map field-level errors from backend
        const fe: Record<string, string> = {};
        err.details.forEach((d: { field: string; message: string }) => {
          fe[d.field] = d.message;
        });
        setFieldErrors(fe);
        setError('Please fix the errors below');
      } else {
        setError(err.message || 'Sign up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-gray-900 border text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
      fieldErrors[field] ? 'border-red-500' : 'border-gray-800 focus:border-emerald-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold logo-gradient-text">PlayStats</span>
          <p className="text-gray-400 mt-2 text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="John Doe"
                className={inputClass('fullName')}
              />
              {fieldErrors.fullName && <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={set('username')}
                placeholder="johndoe"
                className={inputClass('username')}
              />
              {fieldErrors.username && <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              value={form.phoneNumber}
              onChange={set('phoneNumber')}
              onBlur={handlePhoneBlur}
              placeholder="+919876543210"
              className={inputClass('phoneNumber')}
            />
            <p className="text-gray-600 text-xs mt-1">
              {fieldErrors.phoneNumber
                ? <span className="text-red-400">{fieldErrors.phoneNumber}</span>
                : 'With country code — tap outside to auto-add +91'}
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              className={inputClass('email')}
            />
            {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="Min 8 characters"
              className={inputClass('password')}
            />
            {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

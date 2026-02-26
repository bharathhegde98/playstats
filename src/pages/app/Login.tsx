import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isAuthenticated) navigate("/", { replace: true });
	}, [isAuthenticated, navigate]);

	const validate = () => {
		const newErrors: typeof errors = {};
		if (!email.trim()) newErrors.email = "Email is required.";
		else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email address.";
		if (!password.trim()) newErrors.password = "Password is required.";
		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setLoading(true);
		try {
			await login(email, password);
		} catch (err: any) {
			setErrors({ general: err?.message || "Invalid email or password." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen section-base flex items-center justify-center px-5">
			<section className="w-full max-w-sm section-elevated rounded-2xl p-8 shadow-[0_0_25px_rgba(0,0,0,0.12)] dark:shadow-[0_0_25px_rgba(0,0,0,0.4)]">

				{/* Logo */}
				<div className="text-center mb-8">
					<Link to="/" className="inline-flex items-center justify-center gap-3" aria-label="Go to PlayStats homepage">
						<img src="/playstats.png" alt="PlayStats logo" className="h-9 w-auto" />
						<span className="text-xl font-semibold text-gray-900 dark:text-white">
							Play<span className="bg-brand-gradient bg-clip-text text-transparent">Stats</span>
						</span>
					</Link>
					<h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
						Sign in to your account
					</h1>
				</div>

				<form onSubmit={handleSubmit} noValidate className="space-y-5">

					{/* Email */}
					<div>
						<label htmlFor="email" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Email
						</label>
						<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`w-full rounded-xl px-4 py-3 text-sm bg-gray-100 dark:bg-gray-900 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-800"} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`} />
						{errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
					</div>

					{/* Password */}
					<div>
						<label htmlFor="password" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Password
						</label>
						<div className="relative">
							<input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full rounded-xl px-4 py-3 ${password.length > 0 ? "pr-12" : ""} text-sm bg-gray-100 dark:bg-gray-900 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-800"} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`} />
							{password.length > 0 && (
								<button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition" aria-label="Toggle password visibility">
									{showPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-8-9-8a21.77 21.77 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c5 0 9 8 9 8a21.77 21.77 0 01-4.06 5.94M1 1l22 22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>}
								</button>
							)}
						</div>
						{errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
					</div>

					{/* General Error */}
					{errors.general && (
						<div role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3">
							{errors.general}
						</div>
					)}

					<button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm bg-brand-gradient text-gray-950 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? "Signing in..." : "Sign In"}
					</button>

				</form>

				<p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
					Don't have an account?{" "}
					<Link to="/signup" className="font-semibold underline text-emerald-500 hover:text-emerald-400 transition">
						Sign up
					</Link>
				</p>

			</section>
		</div>
	);
}
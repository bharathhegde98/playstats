import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../lib/api";

export default function Signup() {
	const { signup, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) navigate("/", { replace: true });
	}, [isAuthenticated, navigate]);

	const [form, setForm] = useState({
		fullName: "",
		username: "",
		phoneNumber: "",
		email: "",
		password: "",
		confirmPassword: "",
		agree: false,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState("");
	const [loading, setLoading] = useState(false);

	const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = field === "agree" ? e.target.checked : e.target.value;
		setForm((f) => ({ ...f, [field]: value }));
		setFieldErrors((fe) => ({ ...fe, [field]: "" }));
	};

	const validate = () => {
		const errors: Record<string, string> = {};
		if (!form.fullName.trim()) errors.fullName = "Full name is required.";
		if (!form.username.trim()) errors.username = "Username is required.";
		if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
		if (!form.email.trim()) errors.email = "Email is required.";
		else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email.";
		if (!form.password.trim()) errors.password = "Password is required.";
		if (!form.confirmPassword.trim()) errors.confirmPassword = "Confirm your password.";
		if (form.password && form.confirmPassword && form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";
		if (!form.agree) errors.agree = "You must agree to the Terms and Privacy Policy.";
		return errors;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFieldErrors({});
		setGeneralError("");

		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setLoading(true);
		try {
			await signup({
				fullName: form.fullName,
				username: form.username,
				phoneNumber: form.phoneNumber.startsWith("+") ? form.phoneNumber : "+91" + form.phoneNumber,
				email: form.email,
				password: form.password,
			});
		} catch (err: any) {
			if (err instanceof ApiError && err.details?.length) {
				const fe: Record<string, string> = {};
				err.details.forEach((d: { field: string; message: string }) => {
					fe[d.field] = d.message;
				});
				setFieldErrors(fe);
				setGeneralError("Please fix the errors below.");
			} else {
				setGeneralError(err?.message || "Sign up failed.");
			}
		} finally {
			setLoading(false);
		}
	};

	const inputClass = (field: string) =>
		`w-full rounded-xl px-4 py-3 text-sm bg-gray-100 dark:bg-gray-900 border ${fieldErrors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-800"} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`;

	return (
		<div className="min-h-screen section-base flex items-center justify-center px-5 py-10">
			<section className="w-full max-w-lg section-elevated rounded-2xl p-8 shadow-[0_0_25px_rgba(0,0,0,0.12)] dark:shadow-[0_0_25px_rgba(0,0,0,0.4)]">

				<div className="text-center mb-8">
					<Link to="/" className="inline-flex items-center justify-center gap-3">
						<img src="/playstats.png" alt="PlayStats logo" className="h-9 w-auto" />
						<span className="text-xl font-semibold text-gray-900 dark:text-white">
							Play<span className="bg-brand-gradient bg-clip-text text-transparent">Stats</span>
						</span>
					</Link>
					<h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
						Create your account
					</h1>
				</div>

				<form onSubmit={handleSubmit} noValidate className="space-y-6">

					{/* Row 1 */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
							<input type="text" value={form.fullName} onChange={set("fullName")} placeholder="John Doe" className={inputClass("fullName")} />
							{fieldErrors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.fullName}</p>}
						</div>
						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Username</label>
							<input type="text" value={form.username} onChange={set("username")} placeholder="johndoe" className={inputClass("username")} />
							{fieldErrors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.username}</p>}
						</div>
					</div>

					{/* Row 2 */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
							<input type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="+91 9876543210" className={inputClass("phoneNumber")} />
							{fieldErrors.phoneNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phoneNumber}</p>}
						</div>
						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
							<input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputClass("email")} />
							{fieldErrors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
						</div>
					</div>

					{/* Row 3 Passwords */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
							<div className="relative">
								<input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Enter your password" className={`w-full rounded-xl px-4 py-3 ${form.password.length > 0 ? "pr-12" : ""} text-sm bg-gray-100 dark:bg-gray-900 border ${fieldErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-800"} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`} />
								{form.password.length > 0 && (
									<button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition">
										{showPassword ? (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-8-9-8a21.77 21.77 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c5 0 9 8 9 8a21.77 21.77 0 01-4.06 5.94M1 1l22 22"/></svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
										)}
									</button>
								)}
							</div>
							{fieldErrors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>}
						</div>

						<div>
							<label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
							<div className="relative">
								<input type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter your password" className={`w-full rounded-xl px-4 py-3 ${form.confirmPassword.length > 0 ? "pr-12" : ""} text-sm bg-gray-100 dark:bg-gray-900 border ${fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-800"} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`} />
								{form.confirmPassword.length > 0 && (
									<button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition">
										{showConfirmPassword ? (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-8-9-8a21.77 21.77 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c5 0 9 8 9 8a21.77 21.77 0 01-4.06 5.94M1 1l22 22"/></svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
										)}
									</button>
								)}
							</div>
							{fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>}
						</div>
					</div>

					{/* Terms */}
					<div>
						<label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
							<input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-1 accent-emerald-500" />
							<span>
								I agree to the{" "}
								<Link to="/terms" className="underline font-semibold text-emerald-500 hover:text-emerald-400">Terms & Conditions</Link>{" "}
								and{" "}
								<Link to="/privacy" className="underline font-semibold text-emerald-500 hover:text-emerald-400">Privacy Policy</Link>.
							</span>
						</label>
						{fieldErrors.agree && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.agree}</p>}
					</div>

					{generalError && <div role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3">{generalError}</div>}

					<button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm bg-brand-gradient text-gray-950 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? "Creating account..." : "Create Account"}
					</button>

				</form>

				<p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
					Already have an account?{" "}
					<Link to="/login" className="font-semibold underline text-emerald-500 hover:text-emerald-400 transition">
						Sign in
					</Link>
				</p>

			</section>
		</div>
	);
}
import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
	const { isAuthenticated, isLoading } = useAuth();
	const { sportName } = useParams<{ sportName: string }>();

	const [dark, setDark] = useState<boolean>(document.documentElement.classList.contains("dark"));
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);

	useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);

	const toggleTheme = () => {
		const isDark = document.documentElement.classList.toggle("dark");
		localStorage.setItem("theme", isDark ? "dark" : "light");
		setDark(isDark);
	};

	const closeMobile = () => setMobileOpen(false);

	const links = sportName
		? [
				{ label: "Live Matches", path: `/${sportName}/live` },
				{ label: "Tournament Guide", path: `/${sportName}/guide` },
				{ label: "Contact", path: "/contact" },
		  ]
		: [
				{ label: "Cricket", path: "/cricket" },
				{ label: "Volleyball", path: "/volleyball" },
				{ label: "Football", path: "/football" },
				{ label: "Contact", path: "/contact" },
		  ];

	return (
		<header className="fixed top-0 left-0 w-full z-50 section-base border-b border-gray-200 dark:border-gray-800">
			<div className="max-w-7xl mx-auto px-6">
				<div className="h-16 flex items-center justify-between">

					<Link to="/" className="flex items-center gap-3" aria-label="Go to PlayStats homepage">
						<img src="/playstats.png" alt="PlayStats logo" className="h-10" />
						<span className="text-lg font-semibold text-gray-900 dark:text-white">
							Play<span className="bg-brand-gradient bg-clip-text text-transparent">Stats</span>
						</span>
					</Link>

					<div className="flex items-center gap-6">

						<button onClick={toggleTheme} aria-label="Toggle dark mode" aria-pressed={dark} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
							{dark ? "☀️" : "🌙"}
						</button>

						<nav className="hidden lg:block" aria-label="Primary Navigation">
							<ul className="flex items-center gap-6 font-medium">
								{links.map((link) => (
									<li key={link.path}>
										<NavLink to={link.path} className={({ isActive }) => isActive ? "text-emerald-500 font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-emerald-500 transition"}>
											{link.label}
										</NavLink>
									</li>
								))}
							</ul>
						</nav>

						<div className="hidden lg:flex items-center gap-3">
							{isLoading ? (
								<div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
							) : isAuthenticated ? (
								<Link to="/app/dashboard" className="px-5 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition">
									Open App
								</Link>
							) : (
								<>
									<Link to="/login" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition">Login</Link>
									<Link to="/signup" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition">Sign Up</Link>
								</>
							)}
						</div>

						<button onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileOpen} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
							☰
						</button>
					</div>
				</div>
			</div>

			{mobileOpen && <div className="fixed inset-0 bg-black/40 lg:hidden" onClick={closeMobile} aria-hidden="true" />}

			<nav className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-950 shadow-xl transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="Mobile Navigation">
				<div className="p-6 space-y-6">
					<ul className="space-y-4">
						{links.map((link) => (
							<li key={link.path}>
								<NavLink to={link.path} onClick={closeMobile} className="block text-gray-700 dark:text-gray-300 hover:text-emerald-500 transition">
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>

					<div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
						{!isLoading && (
							isAuthenticated ? (
								<Link to="/app/dashboard" onClick={closeMobile} className="block w-full px-4 py-2 bg-emerald-500 text-white text-center rounded-md">Open App</Link>
							) : (
								<>
									<Link to="/login" onClick={closeMobile} className="block w-full px-4 py-2 bg-emerald-500 text-white text-center rounded-md">Login</Link>
									<Link to="/signup" onClick={closeMobile} className="block w-full px-4 py-2 bg-emerald-500 text-white text-center rounded-md">Sign Up</Link>
								</>
							)
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
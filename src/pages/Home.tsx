import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RevealFade from "../components/RevealFade";
import SportCard from "../components/SportCard";
import FeatureCard from "../components/FeatureCard";
import StatCard from "../components/StatCard";
import TestimonialSlider from "../components/TestimonialSlider";
import RegisterSection from "../components/RegisterSection";
import { tournamentsApi, type Tournament } from "../lib/api";

/* ================= Types ================= */

interface Feature {
	title: string;
	desc: string;
}

/* ================= Helpers ================= */

const STATUS_BADGE: Record<string, string> = {
	ongoing: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
	open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
	completed: "bg-gray-700/40 text-gray-500 border-gray-600/30",
	cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SPORT_EMOJI: Record<string, string> = {
	cricket: "🏏",
	football: "⚽",
	volleyball: "🏐",
};

/* ================= Home ================= */

export default function Home() {
	const navigate = useNavigate();
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [tourLoading, setTourLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			tournamentsApi.list({ status: "open", limit: 10 }),
			tournamentsApi.list({ status: "ongoing", limit: 10 }),
			tournamentsApi.list({ status: "draft", limit: 10 }),
		])
			.then(([open, ongoing, draft]) => {
				const merged = [...ongoing, ...open, ...draft];
				const seen = new Set<string>();
				setTournaments(
					merged.filter((t) =>
						seen.has(t.id) ? false : seen.add(t.id) && true
					)
				);
			})
			.catch(() => setTournaments([]))
			.finally(() => setTourLoading(false));
	}, []);

	const features: Feature[] = [
		{ title: "Live Match Tracking", desc: "Real-time scores and player stats instantly." },
		{ title: "Advanced Analytics", desc: "Deep performance breakdowns for teams and players." },
		{ title: "Smart Leaderboards", desc: "Dynamic ranking systems for competitions." },
		{ title: "Tournament Management", desc: "Organize and manage tournaments easily." },
		{ title: "Match Highlights", desc: "Relive key moments from every game." },
		{ title: "Community Network", desc: "Connect with fans and players worldwide." },
	];

	return (
		<>
			{/* ================= Sport Selection ================= */}
			<section className="py-24 section-base">
				<div className="max-w-7xl mx-auto px-6">
					<RevealFade>
						<h1 className="text-center mb-16 text-gray-900 dark:text-white">
							Choose Your Sport
						</h1>
					</RevealFade>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<SportCard name="Cricket" image="/images/card-cricket.jpg" sportId="cricket" />
						<SportCard name="Football" image="/images/card-soccer.jpg" sportId="football" />
						<SportCard name="Volleyball" image="/images/card-vollyball.jpg" sportId="volleyball" />
					</div>
				</div>
			</section>

			{/* ================= Tournaments ================= */}
			<section className="pb-24 section-base">
				<div className="max-w-7xl mx-auto px-6">
					<RevealFade>
						<h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
							Active <span className="bg-brand-gradient bg-clip-text text-transparent">Tournaments</span>
						</h2>
					</RevealFade>

					{tourLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
							))}
						</div>
					) : tournaments.length === 0 ? (
						<div className="text-center py-16">
							<p className="text-5xl mb-4">🏆</p>
							<p className="text-gray-500 dark:text-gray-400">
								No active tournaments yet. Be the first to create one!
							</p>
							<button
								onClick={() => navigate("/login")}
								className="mt-6 px-6 py-3 rounded-xl bg-brand-gradient text-white font-semibold text-sm"
							>
								Get Started
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tournaments.map((t) => (
								<RevealFade key={t.id}>
									<div
										onClick={() => navigate(`/join/${t.inviteCode}`)}
										className="cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
									>
										<div className="flex items-start justify-between gap-3 mb-3">
											<div className="flex-1 min-w-0">
												<span className="text-xl mr-2">
													{SPORT_EMOJI[t.sportType] || "🏅"}
												</span>
												<span className="text-gray-900 dark:text-white font-semibold text-sm">
													{t.name}
												</span>
											</div>
											<span
												className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${
													STATUS_BADGE[t.status] || STATUS_BADGE.draft
												}`}
											>
												{t.status}
											</span>
										</div>

										{t.description && (
											<p className="text-gray-500 text-xs mb-3 line-clamp-2">
												{t.description}
											</p>
										)}

										<div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
											{t.city && <span>📍 {t.city}</span>}
											<span>
												👥 {t.currentTeams}/{t.maxTeams} teams
											</span>
											<span>
												📅{" "}
												{new Date(t.startDate).toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</span>
										</div>

										{t.creator && (
											<p className="text-xs text-gray-400 dark:text-gray-600 mt-3">
												by {t.creator.fullName}
											</p>
										)}
									</div>
								</RevealFade>
							))}
						</div>
					)}
				</div>
			</section>

			{/* ================= Why PlayStats ================= */}
			<section className="section-alt border-t border-gray-200 dark:border-gray-700 py-28">
				<div className="max-w-7xl mx-auto px-6">
					<RevealFade>
						<h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
							Why <span className="bg-brand-gradient bg-clip-text text-transparent">PlayStats</span>?
						</h2>
					</RevealFade>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								number={index + 1}
								title={feature.title}
								desc={feature.desc}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ================= Stats ================= */}
			<section className="py-24 section-base">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<RevealFade>
						<h2 className="mb-16 text-gray-900 dark:text-white">
							PlayStats in{" "}
							<span className="bg-brand-gradient bg-clip-text text-transparent">
								Numbers
							</span>
						</h2>
					</RevealFade>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-12">
						<StatCard target={10000} label="Matches Tracked" />
						<StatCard target={5000} label="Players Registered" />
						<StatCard target={250} label="Tournaments Managed" />
						<StatCard target={1000000} label="Stats Recorded" />
					</div>
				</div>
			</section>

			{/* ================= Register ================= */}
			<section className="py-20 text-center section-gradient">
				<div className="max-w-4xl mx-auto px-6 text-white">
					<RegisterSection
						title="Be Part of the Action"
						description="Join today and start your journey with us."
					/>
				</div>
			</section>

			{/* ================= Testimonials ================= */}
			<section className="section-alt border-t border-gray-200 dark:border-gray-700 py-24">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<RevealFade>
						<h2 className="mb-16 text-gray-900 dark:text-white">
							What Users Say
						</h2>
					</RevealFade>

					<RevealFade>
						<TestimonialSlider />
					</RevealFade>
				</div>
			</section>
		</>
	);
}
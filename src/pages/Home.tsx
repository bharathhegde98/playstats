import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RevealFade from "../components/RevealFade";
import SportCard from "../components/SportCard";
import FeatureCard from "../components/FeatureCard";
import StatCard from "../components/StatCard";
import TestimonialSlider from "../components/TestimonialSlider";
import RegisterSection from "../components/RegisterSection";
import { tournamentsApi, type Tournament } from "../lib/api";
import ActiveTournamentsSection from "../components/ActiveTournamentsSection";
import ContactSection from "../components/ContactSection";

/* ================= Types ================= */

interface Feature {
	title: string;
	desc: string;
}

/* ================= Home ================= */

export default function Home() {

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
							Choose Your <span className="bg-brand-gradient bg-clip-text text-transparent">Sport</span>
						</h1>
					</RevealFade>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						<SportCard name="Cricket" image="/images/card-cricket.jpg" sportId="cricket" />
						<SportCard name="Badminton" image="/images/card-badminton.jpg" sportId="badminton" />
						<SportCard name="Volleyball" image="/images/card-vollyball.jpg" sportId="volleyball" />
					</div>
				</div>
			</section>

			{/* ================= Active Tournaments ================= */}
			<section className="section-alt py-24 border-t border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-6">

					{/* Heading */}
					<RevealFade>
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
						Active <span className="bg-brand-gradient bg-clip-text text-transparent">Tournaments</span>
					</h2>
					</RevealFade>
					<RevealFade>
						<ActiveTournamentsSection />
					</RevealFade>
				</div>
    		</section>


			{/* ================= Why PlayStats ================= */}
			<section className="section-base border-t border-gray-800 py-28">
				<div className="max-w-7xl mx-auto px-6">
					<RevealFade>
						<h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
							Why <span className="bg-brand-gradient bg-clip-text text-transparent">PlayStats?</span>
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
			<section className="py-24 section-alt border-t border-gray-200 dark:border-gray-800">
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
			<section className="section-base border-t border-gray-800 py-24">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<RevealFade>
						<h2 className="mb-16 text-gray-900 dark:text-white">
							What Users <span className="bg-brand-gradient bg-clip-text text-transparent">Say</span>
						</h2>
					</RevealFade>

					<RevealFade>
						<TestimonialSlider />
					</RevealFade>
				</div>
			</section>

			{/* ================= Contact ================= */}
			<section className="section-alt border-t border-gray-200 dark:border-gray-800 py-24">
				<div className="max-w-5xl mx-auto px-6 text-center">
					<RevealFade>
							<h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
								Contact <span className="bg-brand-gradient bg-clip-text text-transparent">Us</span>
							</h2>
					</RevealFade>

					<RevealFade>
						<ContactSection />
					</RevealFade>
				</div>
			</section>

			
		</>
	);
}
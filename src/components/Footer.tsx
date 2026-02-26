import useScrollToTop from "../hooks/useScrollToTop";
import { Link } from "react-router-dom";

export default function Footer() {
	const { visible, scrollToTop } = useScrollToTop();

	return (
		<>
			<footer className="section-base border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 relative">
				<div className="max-w-7xl mx-auto p-6">

					<div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">

						{/* Left */}
						<p className="text-dark-600 text-center sm:text-left">
							© 2026{" "}
							<span className="font-semibold"> Play
								<span className="bg-brand-gradient bg-clip-text text-transparent">Stats</span>
							</span>. All rights reserved.
						</p>

						{/* Center links */}
						<div className="flex items-center gap-6">
							<Link to="/about" className="text-dark-600 hover:text-emerald-600 transition">
								About Us
							</Link>
							<Link to="/terms" className="text-dark-600 hover:text-emerald-600 transition">
								Terms & Services
							</Link>
							<Link to="/privacy" className="text-dark-600 hover:text-emerald-600 transition">
								Privacy Policy
							</Link>
						</div>

						{/* Right */}
						<p className="text-dark-600 dark:text-whit-400 text-center sm:text-right">
							Built with <span className="text-red-500">❤️</span> for sports fans
						</p>
					</div>
				</div>
			</footer>

			{/* Scroll To Top Button */}
			<button onClick={scrollToTop} className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 bg-emerald-500 text-white hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"} `} aria-label="Scroll to top">
				{/* Modern Arrow SVG */}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none"	viewBox="0 0 24 24"	strokeWidth={2}	stroke="currentColor" className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
				</svg>
			</button>
		</>
	);
}

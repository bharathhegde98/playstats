import { useEffect, useState } from "react";

interface Testimonial {
	quote: string;
	name: string;
	role: string;
}

/* ================= Testimonials ================= */

export default function TestimonialSlider() {
	const testimonials: Testimonial[] = [
		{
			quote: "PlayStats completely transformed how we track our local tournaments.",
			name: "Ajay Sharma",
			role: "Tournament Organizer",
		},
		{
			quote: "The analytics and live scoring features are game-changing.",
			name: "Vijay Patel",
			role: "Cricket Coach",
		},
		{
			quote: "Managing matches has never been this easy and professional.",
			name: "Pranav Singh",
			role: "League Manager",
		},
	];

	const [index, setIndex] = useState<number>(0);

	useEffect(() => {
		const interval = setInterval(() => {
		setIndex((prev) => (prev + 1) % testimonials.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [testimonials.length]);

	const current = testimonials[index];

	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-12 transition-colors duration-300">
			
			{/* Quote */}
			<div className="transition-opacity duration-500 ease-in-out">
				<p className="text-gray-800 dark:text-gray-300 italic mb-8 text-lg">
				“{current.quote}”
				</p>

				<h4 className="font-semibold text-gray-900 dark:text-white">
				{current.name}
				</h4>
				<p className="text-gray-500 text-sm">{current.role}</p>
			</div>

			{/* Dots */}
			<div className="flex justify-center gap-3 mt-8">
				{testimonials.map((_, i) => (
				<button
					key={i}
					onClick={() => setIndex(i)}
					className={`w-3 h-3 rounded-full transition-all duration-300 ${
					i === index
						? "bg-emerald-500 scale-110"
						: "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
					}`}
				/>
				))}
			</div>
		</div>
	);
}


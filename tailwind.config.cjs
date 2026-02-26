/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",

	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],

	theme: {
		extend: {

		/* ================= BRAND COLORS ================= */
		colors: {
			brand: {
			start: "#00e676",
			end: "#00e5ff",
			},
		},

		/* ================= BRAND GRADIENT ================= */
		backgroundImage: {
			"brand-gradient": "linear-gradient(135deg, #00e676, #00e5ff)",
		},

		/* ================= STANDARD SECTION COLORS ================= */
		colors: {
			section: {
				light: "#ffffff",     // bg-white
				lightAlt: "#f3f4f6",  // bg-gray-100
				dark: "#030712",      // gray-950
				darkAlt: "#111827",   // gray-900
			},
		},

		/* ================= OPTIONAL: SHADOW STYLE ================= */
		boxShadow: {
			brand: "0 10px 25px rgba(0, 229, 255, 0.15)",
		},

		/* ================= OPTIONAL: TRANSITIONS ================= */
		transitionTimingFunction: {
			smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
		},
		},
	},

	plugins: [],
};
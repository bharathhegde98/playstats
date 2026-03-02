import { useParams } from "react-router-dom";
import SportBanner from "../../components/sport/SportBanner";
import SportTabs from "../../components/sport/SportTabs";
import type { SportType } from "../../types/match";

/* Headline text */
const headlines: Record<SportType, string> = {
	cricket: "Every innings tells a story. Make yours unforgettable.",
	badminton: "Precision in every rally. Power in every point.",
	volleyball: "Rise. Spike. Win. The game starts here.",
};

export default function SportHome() {
	const { sportName } = useParams<{ sportName: SportType }>();

	if (!sportName) {
		return (
			<div className="text-center py-20">
				Sport not found
			</div>
		);
	}

	return (
		<div>
			<SportBanner headline={headlines[sportName] || "Welcome to PlayStats"} image={`/images/hero-${sportName}.jpg`} />

			<div className="max-w-7xl mx-auto px-6 py-16">
				<SportTabs />
			</div>
		</div>
	);
}
import { useParams } from "react-router-dom";
import SportHome from "../pages/sport/SportHome";

export default function SportLayout() {
	const { sportName } = useParams<{ sportName: string }>();

	if (!sportName) return null;

	return (
		<div className="min-h-screen">
			<SportHome sportName={sportName} />
		</div>
	);
}
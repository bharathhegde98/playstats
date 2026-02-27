import DashboardHero from "../../components/dashboard/DashboardHero";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
import MatchesSlider from "../../components/dashboard/MatchesSlider";
import matchesData from "../../data/matches.json";
import type { Match } from "../../types/match";

export default function Dashboard() {
  const matches = matchesData as Match[];

  const liveMatches = matches.filter((m) => m.status === "live");

  return (
    <div className="space-y-10">

      {/* HERO */}
      <DashboardHero />

      {/* LIVE PRIORITY SLIDER */}
      {liveMatches.length > 0 && (
        <MatchesSlider matches={liveMatches} />
      )}

      {/* TOURNAMENT TABS */}
      <DashboardTabs />

    </div>
  );
}
import MatchCard from "../sport/MatchCard";
import type { Match } from "../../types/match";

type Props = {
  matches: Match[];
};

export default function MatchesSlider({ matches }: Props) {
  return (
    <section>
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        Live Matches
      </h3>

      <div className="flex gap-5 overflow-x-auto pb-3">
        {matches.map((match) => (
          <div key={match.id} className="min-w-[320px]">
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </section>
  );
}
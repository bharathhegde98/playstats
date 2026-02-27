import { useState, useMemo } from "react";
import MatchCard from "../sport/MatchCard";
import matchesData from "../../data/matches.json";
import type { Match, MatchStatus } from "../../types/match";

export default function DashboardTabs() {
  const [activeTab, setActiveTab] =
    useState<MatchStatus>("live");

  const matches = matchesData as Match[];

  const filtered = useMemo(() => {
    return matches.filter((m) => m.status === activeTab);
  }, [matches, activeTab]);

  if (filtered.length === 0) return null;

  return (
    <section>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {(["live", "upcoming", "finished"] as MatchStatus[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                activeTab === tab
                  ? "bg-emerald-500 text-gray-950"
                  : "bg-gray-900 border border-gray-800 text-gray-400"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
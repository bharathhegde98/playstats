import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import MatchCard from "./MatchCard";
import matchesData from "../../data/matches.json";
import type { Match, MatchStatus, SportType } from "../../types/match";

export default function SportTabs() {
    /* Properly type route param */
    const { sportName } = useParams<{ sportName: SportType }>();

    const [activeTab, setActiveTab] =
        useState<MatchStatus>("live");

    /* Normalize JSON structure safely */
    const matches: Match[] = useMemo(() => {
        if (Array.isArray(matchesData)) {
            return matchesData as Match[];
        }
        if ("matches" in matchesData) {
            return (matchesData as any).matches as Match[];
        }
        return [];
    }, []);

    /* Validate sport */
    const validSports: SportType[] = [
        "cricket",
        "volleyball",
        "football",
    ];

    if (!sportName || !validSports.includes(sportName)) {
        return (
            <div className="text-center py-20 text-gray-600 dark:text-gray-400">
                Sport not found
            </div>
        );
    }

    /* Filter matches */
    const filteredMatches = useMemo(() => {
        return matches.filter(
            (match) =>
                match.sport === sportName &&
                match.status === activeTab
            );
    }, [matches, sportName, activeTab]);

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto">
            {/* Title */}
            <h2 className="text-3xl font-bold mb-8 text-center capitalize text-gray-900 dark:text-white">
                {sportName} Matches
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
                {(["live", "upcoming", "finished"] as MatchStatus[]).map(
                    (tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full border font-medium transition-all duration-300 capitalize
                            ${
                                activeTab === tab
                                ? "bg-red-500 text-white border-red-500 shadow-md scale-105"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                            }`}
                        >
                            {tab}
                        </button>
                    )
                )}
            </div>

            {/* Cards */}
            {filteredMatches.length > 0 ? (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
                    {filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        No {activeTab} matches available.
                    </p>
                </div>
            )}
        </div>
    );
}
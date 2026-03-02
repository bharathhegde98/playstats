import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentsApi, type Tournament, type Sport } from "../lib/api";
import RevealFade from "./RevealFade";

const SPORTS: { label: string; value: Sport }[] = [
  { label: "Cricket", value: "cricket" },
  { label: "Badminton", value: "badminton" },
  { label: "Volleyball", value: "volleyball" },
];

export default function ActiveTournamentsSection() {
  const navigate = useNavigate();
  const [activeSport, setActiveSport] = useState<Sport>("cricket");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    tournamentsApi
      .list({ sport: activeSport, status: "open", limit: 3 })
      .then(setTournaments)
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, [activeSport]);

  return (
    <>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-10 border-b border-gray-200 dark:border-gray-800">
          {SPORTS.map((sport) => (
            <button
              key={sport.value}
              onClick={() => setActiveSport(sport.value)}
              className={`pb-3 text-sm font-medium transition ${
                activeSport === sport.value
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-gray-500 hover:text-emerald-500"
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No active tournaments.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/join/${t.inviteCode}`)}
                  className="cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-emerald-400 transition"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                    {t.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3">
                    👥 {t.currentTeams}/{t.maxTeams} teams
                  </p>

                  <p className="text-xs text-gray-400">
                    📅{" "}
                    {new Date(t.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* See More */}
            <div className="text-right mt-6">
              <button
                onClick={() => navigate(`/${activeSport}/tournaments`)}
                className="text-emerald-500 text-sm font-medium hover:underline"
              >
                View all {activeSport} tournaments →
              </button>
            </div>
          </>
        )}
    
    </>
        
  );
}
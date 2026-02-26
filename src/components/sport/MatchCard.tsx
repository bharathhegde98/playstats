import { Link } from "react-router-dom";
import type { Match } from "../../types/match";

export default function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  /* ================= SPORT CONTENT ================= */
  const renderSportContent = () => {
    /* ---------- CRICKET ---------- */
    if (match.sport === "cricket") {
      return (
        <>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between font-semibold">
              <span>{match.teamA.name}</span>
              <span>
                {match.teamA.runs ?? 0}-{match.teamA.wickets ?? 0}
                {match.teamA.overs && ` (${match.teamA.overs})`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{match.teamB.name}</span>
              <span>
                {match.teamB.runs !== undefined
                  ? `${match.teamB.runs}-${match.teamB.wickets} (${match.teamB.overs})`
                  : "Yet to bat"}
              </span>
            </div>
          </div>

          {isLive && match.liveInfo && (
            <p className="text-sm text-yellow-500 mt-2">
              Need {match.liveInfo.runsNeeded} runs in{" "}
              {match.liveInfo.ballsLeft} balls
            </p>
          )}

          {match.toss && (
            <p className="text-xs text-gray-500 mt-2">
              Toss: {match.toss.winner} chose to {match.toss.decision}
            </p>
          )}
        </>
      );
    }

    /* ---------- FOOTBALL ---------- */
    if (match.sport === "football") {
      return (
        <div className="mt-5 text-center">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {match.teamA.name}
            </span>

            <span className="text-2xl font-bold">
              {match.teamA.goals ?? "-"} - {match.teamB.goals ?? "-"}
            </span>

            <span className="font-semibold">
              {match.teamB.name}
            </span>
          </div>

          {isLive && (
            <p className="text-red-500 text-sm mt-2">
              {match.matchMinute} {match.extraTime ?? ""}
            </p>
          )}
        </div>
      );
    }

    /* ---------- VOLLEYBALL ---------- */
    if (match.sport === "volleyball") {
      return (
        <div className="mt-5">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {match.teamA.name}
            </span>

            <span className="text-lg font-bold">
              {match.teamA.setsWon ?? 0} - {match.teamB.setsWon ?? 0}
            </span>

            <span className="font-semibold">
              {match.teamB.name}
            </span>
          </div>

          {isLive && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Current Set: {match.teamA.currentSetScore ?? 0} -{" "}
              {match.teamB.currentSetScore ?? 0}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">

      {/* ===== HEADER ===== */}
      <div>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            {match.matchType === "tournament"
              ? match.tournamentName
              : "Individual Match"}
          </span>

          {isLive && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          )}

          {isFinished && (
            <span className="bg-green-600 text-white px-2 py-0.5 rounded-full">
              FT
            </span>
          )}
        </div>

        {/* Stage */}
        <p className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">
          {match.stage}
        </p>

        {/* Date & Time */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {match.date} • {match.startTime}
        </p>

        {/* Location */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {match.venue}, {match.location}
        </p>

        {/* ===== SPORT SPECIFIC CONTENT ===== */}
        {renderSportContent()}

        {/* ===== RESULT ===== */}
        {isFinished && match.result && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-3 font-medium text-center">
            {match.result.winner} won by {match.result.winBy}
          </p>
        )}
      </div>

      {/* ===== VIEW BUTTON ===== */}
      <Link
        to={`/match/${match.id}`}
        className="mt-6 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
      >
        View Match
      </Link>
    </div>
  );
}
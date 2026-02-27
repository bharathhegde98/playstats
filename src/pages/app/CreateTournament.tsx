import { useState } from "react";
import { useSport } from "../../contexts/SportContext";
import { tournamentsApi } from "../../lib/api";

export default function CreateEvent() {
  const { selectedSport } = useSport();
  const sport = selectedSport!;

  const [form, setForm] = useState({
    eventType: "",

    // Tournament
    name: "",
    tournamentImage: "",
    rulesFile: "",
    organizerName: "",
    organizerEmail: "",
    organizerMobile: "",
    startDate: "",
    endDate: "",
    category: "open",
    maxTeamsAllowed: 8,
    minPlayersPerTeam: 6,
    maxPlayersPerTeam: 12,
    venueName: "",
    venueLocation: "",

    // Sport specific
    cricketType: "",
    cricketMatchType: "",
    pitchType: "",
    footballMatchType: "",
    surfaceType: "",
    volleyballMatchType: "",
    courtType: "",

    // Individual
    matchDate: "",
    matchTime: ""
  });

  const inputStyle =
    "w-full rounded-xl px-4 py-3 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition";

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const uploadFile = async (file: File, field: string) => {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const result = await res.json();
    setForm(f => ({ ...f, [field]: result.url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await tournamentsApi.create({ ...form, sportType: sport });
    alert("Created successfully");
  };

  return (
    <div className="min-h-screen section-base flex items-center justify-center px-5">
      <section className="w-full max-w-2xl section-elevated rounded-2xl p-8 shadow">

        <h1 className="text-xl font-semibold text-center mb-6">
          Create {sport.toUpperCase()} Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event Type */}
          <div>
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Event Type
            </label>
            <select value={form.eventType} onChange={set("eventType")} className={inputStyle}>
              <option value="">Select Event Type</option>
              <option value="individual">Individual Match</option>
              <option value="tournament">Tournament</option>
            </select>
          </div>

          {/* ================= INDIVIDUAL ================= */}
          {form.eventType === "individual" && (
            <>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block font-semibold mb-2">Match Date</label>
                    <input
                        type="date"
                        value={form.matchDate}
                        onChange={set("matchDate")}
                        className={inputStyle}
                    />
                    </div>

                    <div>
                    <label className="block font-semibold mb-2">Start Time</label>
                    <input
                        type="time"
                        value={form.matchTime}
                        onChange={set("matchTime")}
                        className={inputStyle}
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block font-semibold mb-2">Venue</label>
                    <input
                        type="text"
                        value={form.venueName}
                        onChange={set("venueName")}
                        className={inputStyle}
                    />
                    </div>

                    <div>
                    <label className="block font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        value={form.venueLocation}
                        onChange={set("venueLocation")}
                        className={inputStyle}
                    />
                    </div>
                </div>

                {/* SPORT SPECIFIC FOR INDIVIDUAL */}

                {sport === "cricket" && (
                    <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Cricket Type</label>
                        <select
                        value={form.cricketType}
                        onChange={set("cricketType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="tennis">Tennis Ball</option>
                        <option value="leather">Leather Ball</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Match Type</label>
                        <select
                        value={form.cricketMatchType}
                        onChange={set("cricketMatchType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="limited">Limited Overs</option>
                        <option value="box">Box Cricket</option>
                        <option value="test">Test Match</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Pitch Type</label>
                        <select
                        value={form.pitchType}
                        onChange={set("pitchType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="rough">Rough</option>
                        <option value="cement">Cement</option>
                        <option value="turf">Turf</option>
                        </select>
                    </div>
                    </div>
                )}

                {sport === "football" && (
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Match Type</label>
                        <select
                        value={form.footballMatchType}
                        onChange={set("footballMatchType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="5v5">5v5</option>
                        <option value="7v7">7v7</option>
                        <option value="11v11">11v11</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Surface</label>
                        <select
                        value={form.surfaceType}
                        onChange={set("surfaceType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="turf">Turf</option>
                        <option value="grass">Grass</option>
                        </select>
                    </div>
                    </div>
                )}

                {sport === "volleyball" && (
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Sets</label>
                        <select
                        value={form.volleyballMatchType}
                        onChange={set("volleyballMatchType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="3_sets">3 Sets</option>
                        <option value="5_sets">5 Sets</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Court Type</label>
                        <select
                        value={form.courtType}
                        onChange={set("courtType")}
                        className={inputStyle}
                        >
                        <option value="">Select</option>
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                        </select>
                    </div>
                    </div>
                )}
                </>
            )}

          {/* ================= TOURNAMENT ================= */}
          {form.eventType === "tournament" && (
            <>
              <div>
                <label className="block font-semibold mb-2">Tournament Name</label>
                <input type="text" value={form.name} onChange={set("name")} className={inputStyle} />
              </div>

              {/* Banner Upload */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <div className="w-32 h-32 rounded-2xl border border-gray-300 dark:border-gray-800 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    {form.tournamentImage ? (
                      <img src={form.tournamentImage} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">Image</span>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-emerald-500 p-2 rounded-full cursor-pointer text-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && uploadFile(e.target.files[0], "tournamentImage")
                      }
                      className="hidden"
                    />
                    📷
                  </label>
                </div>
              </div>

              {/* Rules Upload */}
              <div>
                <label className="block font-semibold mb-2">Rules & Regulations</label>
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) =>
                      e.target.files && uploadFile(e.target.files[0], "rulesFile")
                    }
                  />
                </div>
              </div>

              {/* Organizer */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Organizer Name</label>
                  <input type="text" value={form.organizerName} onChange={set("organizerName")} className={inputStyle} />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Organizer Email</label>
                  <input type="email" value={form.organizerEmail} onChange={set("organizerEmail")} className={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Organizer Phone</label>
                <input type="text" value={form.organizerMobile} onChange={set("organizerMobile")} className={inputStyle} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Start Date</label>
                  <input type="date" value={form.startDate} onChange={set("startDate")} className={inputStyle} />
                </div>
                <div>
                  <label className="block font-semibold mb-2">End Date</label>
                  <input type="date" value={form.endDate} onChange={set("endDate")} className={inputStyle} />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select value={form.category} onChange={set("category")} className={inputStyle}>
                  <option value="open">Open</option>
                  <option value="corporate">Corporate</option>
                  <option value="community">Community</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="other">Other</option>
                  <option value="series">Series</option>
                </select>
              </div>

              {/* Team Rules */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Max Teams</label>
                  <input type="number" value={form.maxTeamsAllowed} onChange={set("maxTeamsAllowed")} className={inputStyle} />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Min Players</label>
                  <input type="number" value={form.minPlayersPerTeam} onChange={set("minPlayersPerTeam")} className={inputStyle} />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Max Players</label>
                  <input type="number" value={form.maxPlayersPerTeam} onChange={set("maxPlayersPerTeam")} className={inputStyle} />
                </div>
              </div>

              {/* Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Venue</label>
                  <input type="text" value={form.venueName} onChange={set("venueName")} className={inputStyle} />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Location</label>
                  <input type="text" value={form.venueLocation} onChange={set("venueLocation")} className={inputStyle} />
                </div>
              </div>

              {/* Sport Specific for Tournament */}
              {sport === "cricket" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Cricket Type</label>
                    <select value={form.cricketType} onChange={set("cricketType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="tennis">Tennis</option>
                      <option value="leather">Leather</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Match Type</label>
                    <select value={form.cricketMatchType} onChange={set("cricketMatchType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="limited">Limited</option>
                      <option value="box">Box</option>
                      <option value="test">Test</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Pitch Type</label>
                    <select value={form.pitchType} onChange={set("pitchType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="rough">Rough</option>
                      <option value="cement">Cement</option>
                      <option value="turf">Turf</option>
                    </select>
                  </div>
                </div>
              )}

              {sport === "football" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Match Type</label>
                    <select value={form.footballMatchType} onChange={set("footballMatchType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="5v5">5v5</option>
                      <option value="7v7">7v7</option>
                      <option value="11v11">11v11</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Surface</label>
                    <select value={form.surfaceType} onChange={set("surfaceType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="turf">Turf</option>
                      <option value="grass">Grass</option>
                    </select>
                  </div>
                </div>
              )}

              {sport === "volleyball" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Sets</label>
                    <select value={form.volleyballMatchType} onChange={set("volleyballMatchType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="3_sets">3 Sets</option>
                      <option value="5_sets">5 Sets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Court Type</label>
                    <select value={form.courtType} onChange={set("courtType")} className={inputStyle}>
                      <option value="">Select</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" className="w-full py-3 rounded-xl font-semibold bg-brand-gradient text-gray-950">
            Create Event
          </button>

        </form>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Search, MapPin, Film, Sparkles, Star, Monitor, Loader2 } from "lucide-react";
import TheaterCard from "../../Components/Theaters/TheaterCard.jsx";
import { getTheaters } from "../../services/api.js";
import heroImage from "../../assets/Theaters Img/PVR IMAX.png";

const allFacilities = ["IMAX", "Dolby Atmos", "4DX", "VIP Lounge", "Recliner Seats", "Parking", "Food Court"];

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const data = await getTheaters();
        setTheaters(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load theaters");
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  const filtered = theaters.filter((t) => {
    const matchesSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase()) ||
      t.city?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || (t.facilities || []).includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const featuredTheater = theaters.find((t) => t.featured);

  const totalScreens = theaters.reduce((sum, t) => sum + (t.screens || 0), 0);

  return (
    <section className="relative min-h-screen w-full bg-[#050505]">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
      `}</style>

      {/* ───── Hero ───── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Premium Cinema"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 backdrop-blur-md ring-1 ring-red-500/10">
            <Film className="h-4 w-4" />
            Premium Cinemas
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Experience Cinema{" "}
            <span className="animate-gradient-text bg-gradient-to-r from-red-400 via-red-500 to-rose-600 bg-clip-text text-transparent">
              Beyond The Screen
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
            Luxury theaters, immersive sound, and unforgettable movie nights.
          </p>
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {/* Stats Strip */}
        {!loading && theaters.length > 0 && (
          <div className="relative z-10 -mt-16 mb-8 animate-fade-up">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-6 py-6 backdrop-blur-xl sm:px-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <Monitor className="mb-2 h-5 w-5 text-red-500" />
                  <div className="text-2xl font-bold text-white">{totalScreens}+</div>
                  <div className="mt-0.5 text-xs text-gray-500">Screens</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Star className="mb-2 h-5 w-5 text-red-500" />
                  <div className="text-2xl font-bold text-white">{theaters.length}</div>
                  <div className="mt-0.5 text-xs text-gray-500">Premium Theaters</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Film className="mb-2 h-5 w-5 text-red-500" />
                  <div className="text-2xl font-bold text-white">
                    {theaters.filter((t) => (t.facilities || []).includes("IMAX")).length}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">IMAX Experiences</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Sparkles className="mb-2 h-5 w-5 text-red-500" />
                  <div className="text-2xl font-bold text-white">
                    {theaters.filter((t) => (t.facilities || []).includes("4DX")).length}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">4DX Available</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="sticky top-20 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 backdrop-blur-2xl sm:px-6 sm:py-5 transition-all duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by theater name or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-white/[0.06] bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-red-500/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", ...allFacilities].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      activeFilter === f
                        ? "bg-red-600 text-white shadow-lg shadow-red-500/20 ring-1 ring-red-500/30"
                        : "border border-white/[0.06] bg-white/[0.03] text-gray-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Theater */}
        {featuredTheater && (
          <div className="mt-10 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Featured Theater This Week</h2>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_80px_rgba(239,68,68,0.12)]">
              <div className="relative h-56 sm:h-72">
                <img
                  src={featuredTheater.image}
                  alt={featuredTheater.name}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                    <Star className="h-4 w-4 fill-red-400" />
                    <span>Featured</span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    {featuredTheater.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-gray-300 sm:text-base">
                    {featuredTheater.description}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.97]">
                      Explore Now
                    </button>
                    <button className="rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-[0.97]">
                      View Showtimes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
              <Film className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">Failed to load theaters</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-white">{filtered.length}</span> theaters
              </p>
              {filtered.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {filtered[0]?.city || "All Locations"}
                </div>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((theater, i) => (
                  <div
                    key={theater._id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <TheaterCard theater={{ ...theater, id: theater._id }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
                  <Search className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white">No theaters found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearch(""); setActiveFilter("All"); }}
                  className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Theaters;

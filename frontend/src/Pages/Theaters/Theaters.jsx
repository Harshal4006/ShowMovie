import React, { useState } from "react";
import { Search, MapPin, Film, Sparkles, Star, Monitor } from "lucide-react";
import TheaterCard from "../../Components/Theaters/TheaterCard.jsx";
import theaters from "../../data/theaters.js";

const allFacilities = ["IMAX", "Dolby Atmos", "4DX", "VIP Lounge", "Recliner Seats", "Parking", "Food Court"];

const Theaters = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = theaters.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || t.facilities.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const featuredTheater = theaters.find((t) => t.featured);

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
      `}</style>

      {/* ───── Hero ───── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80"
          alt="Premium Cinema"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]" />
        {/* Red ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12),transparent_70%)]" />
        {/* Projector glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 backdrop-blur-sm ring-1 ring-red-500/10">
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
        <div className="relative z-10 -mt-16 mb-8">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0f]/80 px-6 py-6 backdrop-blur-xl sm:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: Monitor, label: "Screens", value: "50+" },
                { icon: Star, label: "Premium Theaters", value: "10" },
                { icon: Film, label: "IMAX Experience", value: "8K" },
                { icon: Sparkles, label: "4DX Available", value: "6" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <stat.icon className="mb-2 h-5 w-5 text-red-500" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filters - Glassmorphism Container */}
        <div className="sticky top-20 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 backdrop-blur-2xl sm:px-6 sm:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
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

              {/* Filter Pills */}
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
          <div className="mt-10 mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Featured Theater This Week</h2>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_60px_rgba(239,68,68,0.1)]">
              <div className="relative h-56 sm:h-72">
                <img
                  src={featuredTheater.image}
                  alt={featuredTheater.name}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
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

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-white">{filtered.length}</span> theaters
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4 text-red-500" />
            Mumbai
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((theater) => (
              <TheaterCard key={theater.id} theater={theater} />
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
      </div>
    </section>
  );
};

export default Theaters;

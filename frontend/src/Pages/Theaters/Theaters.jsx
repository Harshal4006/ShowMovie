import React, { useState } from "react";
import { Search, MapPin, Film } from "lucide-react";
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

  return (
    <section className="relative min-h-screen w-full">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden sm:h-80 md:h-96">
        <img
          src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1600&q=80"
          alt="Cinema Hall"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#050505]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-1.5 text-sm font-medium text-red-400 backdrop-blur-sm">
            <Film className="h-4 w-4" />
            Premium Cinemas
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Experience Movies <span className="text-red-500">Like Never Before</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-400 sm:text-lg">
            Discover the best cinemas near you with world-class screens, immersive sound, and luxury seating.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {/* Search & Filters */}
        <div className="sticky top-20 z-20 -mx-4 bg-[#050505]/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by theater name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-red-500/50 focus:bg-white/10 focus:ring-1 focus:ring-red-500/20"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("All")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === "All"
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "border border-white/10 bg-white/5 text-gray-400 hover:border-red-500/30 hover:text-white"
                }`}
              >
                All
              </button>
              {allFacilities.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeFilter === f
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                      : "border border-white/10 bg-white/5 text-gray-400 hover:border-red-500/30 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 mb-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-white">{filtered.length}</span> theaters
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">No theaters found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(""); setActiveFilter("All"); }}
              className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
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

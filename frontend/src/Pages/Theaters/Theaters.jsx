import React from 'react';
import { MapPin, Loader2 } from "lucide-react";
import TheaterCard from "../../Components/Theaters/TheaterCard.jsx";
import useTheaters from "../../Components/Theaters/Theaters/useTheaters.js";
import TheatersHeroSection from "../../Components/Theaters/Theaters/TheatersHeroSection.jsx";
import TheatersStatsStrip from "../../Components/Theaters/Theaters/TheatersStatsStrip.jsx";
import TheatersSearchFilter from "../../Components/Theaters/Theaters/TheatersSearchFilter.jsx";
import TheatersFeaturedCard from "../../Components/Theaters/Theaters/TheatersFeaturedCard.jsx";
import TheatersEmptyState from "../../Components/Theaters/Theaters/TheatersEmptyState.jsx";
import TheatersErrorState from "../../Components/Theaters/Theaters/TheatersErrorState.jsx";

const Theaters = () => {
  const {
    loading, error, search, setSearch,
    activeFilter, setActiveFilter, filtered,
    featuredTheater, totalScreens, theaters, allFacilities,
  } = useTheaters();

  const imaxCount = theaters.filter((t) => (t.facilities || []).includes("IMAX")).length;
  const dxCount = theaters.filter((t) => (t.facilities || []).includes("4DX")).length;

  return (
    <section className="relative min-h-screen w-full">
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

      <TheatersHeroSection />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
        {!loading && theaters.length > 0 && (
          <TheatersStatsStrip
            totalScreens={totalScreens}
            theaterCount={theaters.length}
            imaxCount={imaxCount}
            dxCount={dxCount}
          />
        )}

        <TheatersSearchFilter
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          allFacilities={allFacilities}
        />

        <TheatersFeaturedCard theater={featuredTheater} />

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        )}

        {error && !loading && <TheatersErrorState message={error} />}

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
              <TheatersEmptyState onClear={() => { setSearch(""); setActiveFilter("All"); }} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Theaters;

// Movies page - browse, search, filter, and sort movies
import { useMemo, useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import FeatureCard from "../../Components/FeatureSection/FeatureCard.jsx";
import { MovieGridSkeleton } from "../../Components/Skeletons";

import { getMovies } from "../../services/api";

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const section = searchParams.get("section");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getMovies({ genre, search, sort, page, limit: 12, section });
        setMovies(data.movies || []);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [search, genre, sort, page, section]);

  // Extract unique genres from all movies
  const allGenres = useMemo(() => {
    const names = new Set();
    for (const movie of movies) {
      for (const item of movie?.genres ?? []) {
        if (item?.name) names.add(item.name);
      }
    }
    return ["all", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }, [movies]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setSearch("");
    setGenre("all");
    setSort("newest");
    setPage(1);
    setSearchParams({});
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'featured': return 'Featured Movies';
      case 'trending': return 'Trending Movies';
      case 'mostPopular': return 'Most Popular';
      default: return 'Explore All Films';
    }
  };

  return (
    <section className="relative w-full px-4 pb-16 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
            {getSectionTitle()}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:mt-4 sm:text-base">
            {section ? `Browse all ${section.replace(/([A-Z])/g, ' $1').toLowerCase()} movies.` : "Browse all available shows and find your next favorite film."}
          </p>
        </div>

        <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 p-4 backdrop-blur-sm sm:mt-12 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end sm:gap-4 lg:grid-cols-3">
            <label className="block sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-medium text-gray-400">Search</span>
              <input
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search by title..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-100 outline-none backdrop-blur transition focus:border-red-500/40"
                type="search"
                aria-label="Search movies"
              />
            </label>

            <label className="block" htmlFor="genre-filter">
              <span className="text-xs font-medium text-gray-400">Genre</span>
              <div className="relative mt-2">
                <select
                  id="genre-filter"
                  value={genre}
                  onChange={(event) => { setGenre(event.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-gray-100 outline-none backdrop-blur transition focus:border-red-500/40"
                >
                  {allGenres.map((name) => (
                    <option key={name} value={name} className="bg-[#0b0d12]">
                      {name === "all" ? "All genres" : name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block" htmlFor="sort-order">
              <span className="text-xs font-medium text-gray-400">Sort</span>
              <div className="relative mt-2">
                <select
                  id="sort-order"
                  value={sort}
                  onChange={(event) => { setSort(event.target.value); setPage(1); }}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-gray-100 outline-none backdrop-blur transition focus:border-red-500/40"
                >
                  <option value="newest" className="bg-[#0b0d12]">Newest</option>
                  <option value="oldest" className="bg-[#0b0d12]">Oldest</option>
                  <option value="rating" className="bg-[#0b0d12]">Rating</option>
                  <option value="title" className="bg-[#0b0d12]">Title</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="font-semibold text-gray-200">{movies.length}</span> {section ? 'of ' + total : ''} movies
            </p>
            <div className="flex gap-2">
              {section && (
                <button
                  type="button"
                  onClick={() => { setSearchParams({}); }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-200 transition hover:border-red-500/35 hover:bg-red-500/10"
                >
                  Clear Filter
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-200 transition hover:border-red-500/35 hover:bg-red-500/10"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading / empty state */}
        {loading ? (
          <MovieGridSkeleton count={8} />
        ) : movies.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {movies.map((movie) => (
                <FeatureCard key={movie._id || movie.tmdbId} movie={movie} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 px-6 py-12 text-center backdrop-blur-sm">
            <p className="text-base font-semibold text-gray-100">No movies found</p>
            <p className="mt-2 text-sm text-gray-400">Try changing your search, genre, or sort.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Movies;
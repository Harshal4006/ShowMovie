import { Loader2 } from "lucide-react";

const MovieGrid = ({ movies, selectedMovie, activeTab, loading, onSelect }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-red-500" />
      </div>
    );
  }

  const getSubtitle = () => {
    if (activeTab === "now-playing") return "Currently in theaters";
    if (activeTab === "upcoming") return "Coming soon to theaters";
    if (activeTab === "trending") return "Trending this week";
    if (activeTab === "popular") return "Most popular movies";
    return "Search results";
  };

  return (
    <>
      <p className="text-xs text-gray-500 mb-3">{getSubtitle()}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelect(movie)}
            className={`cursor-pointer group rounded-lg overflow-hidden border-2 transition ${
              selectedMovie?.id === movie.id || selectedMovie?.tmdbId === movie.id
                ? "border-red-500 bg-red-500/10"
                : "border-transparent hover:border-gray-600"
            }`}
          >
            <div className="aspect-[2/3] bg-gray-900">
              {movie.poster_path || movie.posterUrl ? (
                <img
                  src={movie.posterUrl || `https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  No Poster
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-900">
              <p className="text-xs text-white truncate font-medium">{movie.title}</p>
              <p className="text-xs text-gray-500">{movie.release_date?.split("-")[0]}</p>
            </div>
          </div>
        ))}
        {movies.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            {activeTab === "search" ? "Search for a movie to add a show" : "No movies found"}
          </div>
        )}
      </div>
    </>
  );
};

export default MovieGrid;

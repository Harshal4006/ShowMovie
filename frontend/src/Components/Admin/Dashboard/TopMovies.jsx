const TopMovies = ({ topMovies }) => {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Top Movies</h3>
      <div className="space-y-3">
        {topMovies.map((movie, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800 text-xs font-medium text-gray-400">
                {idx + 1}
              </span>
              <span className="text-sm truncate max-w-[120px]">{movie.title}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
              {movie.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMovies;
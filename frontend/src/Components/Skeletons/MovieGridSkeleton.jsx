import MovieCardSkeleton from "./MovieCardSkeleton";

const MovieGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MovieGridSkeleton;
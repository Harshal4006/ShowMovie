const LoadingState = () => {
  return (
    <div className="rounded-4xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-3 mb-6">
          <div className="h-8 w-2/3 rounded-2xl bg-gradient-to-r from-white/20 via-white/10 to-white/20" />
          <div className="h-4 w-1/2 rounded-2xl bg-gradient-to-r from-white/15 via-white/5 to-white/15" />
        </div>

        {/* Movie Poster Skeleton */}
        <div className="flex gap-4 mb-6">
          <div className="w-24 h-36 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 rounded-xl bg-gradient-to-r from-white/15 via-white/5 to-white/15 animate-pulse" />
            <div className="h-4 w-1/2 rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse" />
          </div>
        </div>

        {/* Seat Grid Skeleton */}
        <div className="space-y-3">
          <div className="h-10 w-full rounded-2xl bg-gradient-to-r from-white/15 via-white/5 to-white/15 animate-pulse" />
          <div className="h-10 w-full rounded-2xl bg-gradient-to-r from-white/15 via-white/5 to-white/15 animate-pulse" />
          <div className="h-10 w-full rounded-2xl bg-gradient-to-r from-white/15 via-white/5 to-white/15 animate-pulse" />
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mt-8">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-b-red-400/50 rounded-full animate-spin spinner-inner"></div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4 animate-pulse">
          Loading seat layout...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;


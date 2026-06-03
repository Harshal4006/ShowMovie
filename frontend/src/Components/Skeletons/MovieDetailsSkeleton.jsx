
const MovieDetailsSkeleton = () => {
  return (
    <section className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Back button skeleton */}
        <div className="mb-8 h-6 w-32 rounded-lg bg-gray-800 animate-pulse" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left column - Poster */}
          <div className="lg:col-span-1 animate-pulse">
            <div className="aspect-[2/3] w-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900" />
            <div className="mt-4 h-10 w-full rounded-xl bg-gray-800" />
            <div className="mt-3 h-10 w-2/3 rounded-xl bg-gray-800" />
          </div>

          {/* Right column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded-xl bg-gray-800" />
              <div className="h-6 w-1/2 rounded-xl bg-gray-700" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-700" />
                <div className="h-6 w-16 rounded-full bg-gray-700" />
                <div className="h-6 w-16 rounded-full bg-gray-700" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full rounded-lg bg-gray-800" />
              <div className="h-4 w-full rounded-lg bg-gray-800" />
              <div className="h-4 w-3/4 rounded-lg bg-gray-800" />
            </div>

            {/* Showtimes skeleton */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-7 w-24 rounded-lg bg-gray-700 mb-6" />
              <div className="flex gap-3 mb-6">
                <div className="h-12 w-20 rounded-2xl bg-gray-800" />
                <div className="h-12 w-20 rounded-2xl bg-gray-800" />
                <div className="h-12 w-20 rounded-2xl bg-gray-800" />
                <div className="h-12 w-20 rounded-2xl bg-gray-800" />
              </div>
              <div className="h-6 w-32 rounded-lg bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Cast skeleton */}
        <div className="mt-12">
          <div className="h-7 w-16 rounded-lg bg-gray-700 mb-6" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-gray-800" />
                <div className="mt-2 h-4 w-20 rounded-lg bg-gray-800 mx-auto" />
                <div className="mt-1 h-3 w-14 rounded-lg bg-gray-900 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Related movies skeleton */}
        <div className="mt-12">
          <div className="h-7 w-36 rounded-lg bg-gray-700 mb-6" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-[1.9rem] border border-white/10 bg-white/4 p-3 animate-pulse">
                <div className="aspect-16/10 bg-gray-800 rounded-[1.05rem]" />
                <div className="mt-4 h-6 w-3/4 rounded-lg bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsSkeleton;
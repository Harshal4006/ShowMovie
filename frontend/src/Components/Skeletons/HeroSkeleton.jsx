
const HeroSkeleton = () => {
  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />

      <div className="relative z-10 max-w-2xl px-4 text-center">
        <div className="mx-auto h-16 w-80 rounded-2xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 sm:h-20 sm:w-96" />
        <div className="mx-auto mt-6 h-6 w-64 rounded-xl bg-gray-800 sm:h-8 sm:w-80" />
        <div className="mx-auto mt-4 h-4 w-48 rounded-xl bg-gray-900 sm:h-5 sm:w-64" />

        <div className="mt-8 h-12 w-40 rounded-full bg-gray-800" />
      </div>
    </div>
  );
};

export default HeroSkeleton;
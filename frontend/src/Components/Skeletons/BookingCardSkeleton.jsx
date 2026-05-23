
const BookingCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[1.9rem] border border-white/10 bg-white/4 p-4">
      <div className="flex gap-4">
        <div className="h-28 w-20 rounded-xl bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded-lg bg-gray-700" />
          <div className="h-4 w-1/2 rounded-lg bg-gray-800" />
          <div className="mt-3 h-4 w-1/3 rounded-lg bg-gray-800" />
          <div className="h-4 w-1/4 rounded-lg bg-gray-800" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="h-4 w-20 rounded-lg bg-gray-800" />
        <div className="h-9 w-28 rounded-full bg-gray-700" />
      </div>
    </div>
  );
};

export default BookingCardSkeleton;
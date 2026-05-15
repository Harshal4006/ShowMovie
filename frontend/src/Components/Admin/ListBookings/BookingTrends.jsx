const BookingTrends = () => {
  const data = [35, 55, 75, 90, 65, 85, 45];

  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
      <div className="h-40 sm:h-48 flex items-end justify-between gap-2">
        {data.map((height, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-red-700 to-red-500 transition-all hover:from-red-600 hover:to-red-400"
              style={{ height: `${height}%` }}
            />
            <span className="mt-2 text-xs text-gray-500">Day {idx + 1}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500 text-center">Daily booking volume over the last week</p>
    </div>
  );
};

export default BookingTrends;
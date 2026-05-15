const BookingsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 lg:mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="rounded-xl bg-gray-900 border border-gray-800 p-4">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">{stat.label}</div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          {stat.note && <div className="text-xs text-gray-500 mt-1">{stat.note}</div>}
        </div>
      ))}
    </div>
  );
};

export default BookingsStats;
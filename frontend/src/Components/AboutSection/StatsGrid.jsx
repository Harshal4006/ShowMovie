const StatsGrid = ({ stats }) => {
  return (
    <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[1.4rem] border border-white/8 bg-white/03 px-5 py-5"
        >
          <p className="text-3xl font-semibold text-white">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
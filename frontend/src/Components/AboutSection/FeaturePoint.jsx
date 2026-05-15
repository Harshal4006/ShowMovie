const FeaturePoint = ({ point }) => {
  const Icon = point.icon;

  return (
    <div
      key={point.title}
      className="rounded-3xl border border-white/8 bg-white/3 px-5 py-5"
    >
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">
            {point.title}
          </h3>
          <p className="mt-2 text-sm leading-7 text-gray-400">
            {point.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturePoint;
const SystemStatus = () => {
  const statusItems = [
    { label: "Booking Service", status: "Online", color: "green", pulse: true },
    { label: "Payment Gateway", status: "Stable", color: "green", pulse: false },
    { label: "Database", status: "Moderate", color: "yellow", pulse: false },
  ];

  const colorClasses = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      <div className="space-y-3">
        {statusItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colorClasses[item.color]}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${item.color}-400 ${item.pulse && "animate-pulse"}`} />
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
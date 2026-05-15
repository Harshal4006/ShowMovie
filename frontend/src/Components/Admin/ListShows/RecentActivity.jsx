const RecentActivity = ({ activities }) => {
  return (
    <div className="md:col-span-1 lg:col-span-2 rounded-xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
            <div>
              <div className="font-medium text-sm">{activity.action}</div>
              <div className="text-xs text-gray-500">{activity.details}</div>
            </div>
            <div className="text-xs text-gray-500">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
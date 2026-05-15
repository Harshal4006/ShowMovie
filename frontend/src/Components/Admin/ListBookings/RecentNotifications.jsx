const RecentNotifications = ({ notifications }) => {
  return (
    <div className="md:col-span-1 lg:col-span-2 rounded-xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
      <div className="space-y-3">
        {notifications.map((note, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
            <span className="text-sm text-gray-300">{note.text}</span>
            <span className="text-xs text-gray-500">{note.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNotifications;
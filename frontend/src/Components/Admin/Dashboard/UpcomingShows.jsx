import { Clock } from "lucide-react";

const UpcomingShows = ({ upcomingShows }) => {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4">Upcoming Shows</h3>
      <div className="space-y-3">
        {upcomingShows.map((show, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Clock size={14} />
              </div>
              <span className="text-sm text-gray-300">{show.label}</span>
            </div>
            <span className="text-xs font-medium text-red-400">{show.screen}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingShows;
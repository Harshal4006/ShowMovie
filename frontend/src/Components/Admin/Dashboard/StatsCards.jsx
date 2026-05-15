import { TrendingUp } from "lucide-react";

const colorClasses = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
};

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color];
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-5 hover:border-gray-700 transition-colors group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text} border ${colors.border}`}>
                <Icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.changeType === "positive" ? "text-green-400" : "text-red-400"
              }`}>
                <TrendingUp size={12} className={stat.changeType === "negative" && "rotate-180"} />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
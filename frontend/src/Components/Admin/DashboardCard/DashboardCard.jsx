import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Ticket, Film } from "lucide-react";

const DashboardCard = ({ title, value, change, icon, color }) => {
  const IconComponent = icon;
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl bg-gray-900 p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">{title}</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-white truncate">{value}</p>
          <div className="mt-1 sm:mt-2 flex items-center gap-1 flex-wrap">
            {isPositive ? (
              <ArrowUpRight size={14} className="text-green-500 flex-shrink-0" />
            ) : (
              <ArrowDownRight size={14} className="text-red-500 flex-shrink-0" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"} flex-shrink-0`}>
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 truncate">from last month</span>
          </div>
        </div>
        <div className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full ${color} ml-3 flex-shrink-0`}>
          <IconComponent size={20} className="text-white sm:size-7" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="text-xs sm:text-sm text-gray-400 truncate">View details</div>
        <TrendingUp size={16} className="text-gray-500 sm:size-[18px]" />
      </div>
    </div>
  );
};

export default DashboardCard;
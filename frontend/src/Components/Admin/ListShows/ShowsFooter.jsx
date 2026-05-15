import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

const ShowsFooter = ({ quickActions, recentActivity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      <QuickActions actions={quickActions} />
      <RecentActivity activities={recentActivity} />
    </div>
  );
};

export default ShowsFooter;
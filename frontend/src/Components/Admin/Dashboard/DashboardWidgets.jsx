import TopMovies from "./TopMovies";
import UpcomingShows from "./UpcomingShows";
import SystemStatus from "./SystemStatus";

const DashboardWidgets = ({ topMovies, upcomingShows }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <TopMovies topMovies={topMovies} />
      <UpcomingShows upcomingShows={upcomingShows} />
      <SystemStatus />
    </div>
  );
};

export default DashboardWidgets;
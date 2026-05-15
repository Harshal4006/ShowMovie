import QuickActions from "./QuickActions";
import RecentNotifications from "./RecentNotifications";

const BookingsFooter = ({ helpActions, notifications }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      <QuickActions actions={helpActions} />
      <RecentNotifications notifications={notifications} />
    </div>
  );
};

export default BookingsFooter;
import { Link } from "react-router-dom";
import CountdownTimer from "../CountdownTimer/CountdownTimer.jsx";

const ShowTimes = ({ showDates, selectedDate, setSelectedDate, movie }) => {
  if (!Array.isArray(showDates) || showDates.length === 0) {
    return (
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-gray-200 backdrop-blur-sm">
        <h2 className="mb-2 text-2xl font-semibold text-white">Showtimes</h2>
        <p className="text-sm text-gray-400">No active shows available for this movie right now.</p>
      </div>
    );
  }

  // Calculate the next show time for countdown
  const getNextShowTime = () => {
    if (!selectedDate) return null;
    
    const selectedShow = showDates.find((d) => d.date === selectedDate);
    if (!selectedShow || !selectedShow.timeSlots.length) return null;
    
    // Get current date and time
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // If selected date is today, find next time slot
    if (selectedDate === today) {
      const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
      
      // Loop through time slots to find the next upcoming show
      for (const timeSlot of selectedShow.timeSlots) {
        const [time, period] = timeSlot.split(' ');
        const [hoursStr, minutesStr] = time.split(':');
        let hours = parseInt(hoursStr);
        const minutes = parseInt(minutesStr || '0');
        
        // Convert AM/PM to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const slotTime = hours * 60 + minutes;
        
        // If this slot is in the future, use it
        if (slotTime > currentTime) {
          const targetDate = new Date(now);
          targetDate.setHours(hours, minutes, 0, 0);
          return targetDate;
        }
      }
    }
    
    // Default to first time slot of selected date
    const firstTime = selectedShow.timeSlots[0];
    const [time, period] = firstTime.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr || '0');
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const targetDate = new Date(selectedDate);
    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
  };

const nextShowTime = getNextShowTime();
    const movieId = movie?._id || movie?.id || movie?.tmdbId;
    const movieObjId = movie?._id;

  return (
    <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-2xl font-semibold text-white">Showtimes</h2>
      
      {/* Countdown Timer */}
      {nextShowTime && (
        <div className="mb-6">
          <CountdownTimer
            targetDate={nextShowTime}
            title={`Next show on ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} starts in`}
          />
        </div>
      )}
      
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {showDates.map((showDate) => (
          <button
            key={showDate.date}
            type="button"
            onClick={() => setSelectedDate(showDate.date)}
            aria-label={`Select ${showDate.day}, ${new Date(showDate.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}`}
            aria-pressed={selectedDate === showDate.date}
            className={`rounded-2xl border px-4 py-3 text-center transition ${
              selectedDate === showDate.date
                ? "border-red-500/40 bg-red-500/10 text-red-100"
                : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
            }`}
          >
            <p className="text-sm font-medium">{showDate.day}</p>
            <p className="text-xs text-gray-400">
              {new Date(showDate.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </button>
        ))}
      </div>

      {selectedDate && (
        <div>
          <h3 className="mb-3 text-lg font-medium text-white">Available Times</h3>
          <div className="flex flex-wrap gap-3">
{showDates
              .find((d) => d.date === selectedDate)
              ?.timeSlots.map((slot, index) => (
                <Link
                  key={index}
                  to={`/movies/${movieId}/${selectedDate}?time=${encodeURIComponent(slot.label)}&showId=${slot.showId}&price=${slot.price || 0}`}
                  aria-label={`Book for ${slot.label}`}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                >
                  {slot.label}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowTimes;

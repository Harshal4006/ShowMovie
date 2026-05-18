import { Link } from "react-router-dom";
import { useMemo } from "react";
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

  const nextShowTime = useMemo(() => {
    if (!selectedDate) return null;
    
    const selectedShow = showDates.find((d) => d.date === selectedDate);
    if (!selectedShow || !selectedShow.timeSlots || selectedShow.timeSlots.length === 0) return null;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (selectedDate === today) {
      const currentMs = now.getTime();
      
      for (const slot of selectedShow.timeSlots) {
        if (!slot || !slot.showId) continue;
        const slotDate = new Date(slot.showDateTime || selectedDate);
        if (slotDate.getTime() > currentMs) {
          return slotDate;
        }
      }
    }
    
    return selectedShow.timeSlots[0]?.showDateTime 
      ? new Date(selectedShow.timeSlots[0].showDateTime)
      : null;
  }, [selectedDate, showDates]);

  const movieId = movie?._id || movie?.id || movie?.tmdbId;

  return (
    <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-2xl font-semibold text-white">Showtimes</h2>
      
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
          {showDates.find((d) => d.date === selectedDate)?.timeSlots?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {showDates
                .find((d) => d.date === selectedDate)
                ?.timeSlots.map((slot, index) => (
                  <Link
                    key={slot.showId || index}
                    to={`/movies/${movieId}/${selectedDate}?time=${encodeURIComponent(slot.label || '')}&showId=${slot.showId || ''}&price=${slot.price || 0}`}
                    aria-label={`Book for ${slot.label || 'Show ' + (index + 1)}`}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                  >
                    {slot.label}
                  </Link>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No show times available for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowTimes;

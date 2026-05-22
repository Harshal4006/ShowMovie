import { X } from "lucide-react";

const ShowtimeFields = ({ showtimes, onUpdate, error }) => {
  const handleChange = (idx, field, value) => {
    const next = showtimes.map((st, i) => (i === idx ? { ...st, [field]: value } : st));
    onUpdate(next);
  };

  const handleRemove = (idx) => {
    onUpdate(showtimes.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    onUpdate([...showtimes, { date: "", time: "" }]);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">Show Date & Time *</label>
      {showtimes.map((st, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="date"
            value={st.date}
            onChange={(e) => handleChange(idx, "date", e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          />
          <input
            type="time"
            value={st.time}
            onChange={(e) => handleChange(idx, "time", e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          />
          {showtimes.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-2 text-gray-400 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-red-400 hover:text-red-300"
      >
        + Add Another Showtime
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ShowtimeFields;

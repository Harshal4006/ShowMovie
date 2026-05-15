import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ShowtimesSection = ({ formData, setFormData, errors, setErrors }) => {
  const handleShowtimeChange = (index, field, value) => {
    const updatedShowtimes = [...formData.showtimes];
    updatedShowtimes[index] = { ...updatedShowtimes[index], [field]: value };
    setFormData((prev) => ({ ...prev, showtimes: updatedShowtimes }));

    if (errors.showtimes) {
      setErrors((prev) => ({ ...prev, showtimes: "" }));
    }
  };

  const addShowtime = () => {
    setFormData((prev) => ({
      ...prev,
      showtimes: [...prev.showtimes, { date: "", time: "" }]
    }));
  };

  const removeShowtime = (index) => {
    if (formData.showtimes.length > 1) {
      const updatedShowtimes = formData.showtimes.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, showtimes: updatedShowtimes }));
    } else {
      toast.error("At least one showtime is required");
    }
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">Showtimes *</label>
        <button
          type="button"
          onClick={addShowtime}
          className="flex items-center gap-1 rounded-lg bg-gray-800 px-3 py-1 text-sm hover:bg-gray-700"
        >
          <Plus size={14} />
          Add Showtime
        </button>
      </div>

      {formData.showtimes.map((showtime, index) => (
        <div key={index} className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-400">Date</label>
            <input
              type="date"
              value={showtime.date}
              onChange={(e) => handleShowtimeChange(index, 'date', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-400">Time</label>
            <input
              type="time"
              value={showtime.time}
              onChange={(e) => handleShowtimeChange(index, 'time', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => removeShowtime(index)}
              className="h-10 w-10 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:border-red-500 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-700 disabled:hover:bg-gray-800 disabled:hover:text-gray-400"
              disabled={formData.showtimes.length <= 1}
              title="Remove this showtime"
            >
              <Trash2 size={16} className="mx-auto" />
            </button>
          </div>
        </div>
      ))}
      {errors.showtimes && <p className="mt-1 text-sm text-red-500">{errors.showtimes}</p>}
    </div>
  );
};

export default ShowtimesSection;
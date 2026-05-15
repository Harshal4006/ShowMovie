import { X } from "lucide-react";
import ShowForm from "../ShowForm/ShowForm";

const ShowEditModal = ({ show, onClose, onSubmit }) => {
  if (!show) return null;

  const initialData = {
    ...show,
    price: String(show.price ?? ""),
    showtimes: show.showtimes?.length > 0
      ? show.showtimes
      : [{ date: show.date || "", time: show.time || "" }],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold">Edit Show</h3>
            <p className="text-sm text-gray-500 mt-0.5">{show.movieName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">
          <ShowForm
            key={show.id}
            isEditing
            initialData={initialData}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowEditModal;
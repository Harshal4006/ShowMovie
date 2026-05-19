import { X, IndianRupee } from "lucide-react";

const ShowViewModal = ({ show, onClose, onEdit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold">{show.movieName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{show.theater}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1">
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                {show.poster ? (
                  <img src={show.poster} alt={show.movieName} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">No poster</div>
                )}
              </div>
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-900 p-3">
                <div className="text-xs text-gray-500">Date</div>
                <div className="mt-1 font-medium">{show.date}</div>
              </div>
              <div className="rounded-lg bg-gray-900 p-3">
                <div className="text-xs text-gray-500">Time</div>
                <div className="mt-1 font-medium">{show.time}</div>
              </div>
              <div className="rounded-lg bg-gray-900 p-3">
                <div className="text-xs text-gray-500">Language</div>
                <div className="mt-1 font-medium">{show.language}</div>
              </div>
              <div className="rounded-lg bg-gray-900 p-3">
                <div className="text-xs text-gray-500">Screen</div>
                <div className="mt-1 font-medium">{show.screenType}</div>
              </div>
              <div className="col-span-2 rounded-lg bg-gray-900 p-3">
                <div className="text-xs text-gray-500">Price</div>
                <div className="flex items-center font-bold text-lg"><IndianRupee size={16} className="inline self-center" />{show.price}</div>
              </div>
            </div>
          </div>
          {show.description && (
            <div className="mt-5 rounded-lg bg-gray-900 p-4">
              <div className="text-xs text-gray-500 mb-1">Description</div>
              <p className="text-sm text-gray-300">{show.description}</p>
            </div>
          )}
          <div className="mt-5 flex gap-3 justify-end">
            <button
              onClick={() => {
                onEdit(show.id);
              }}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Edit Show
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowViewModal;
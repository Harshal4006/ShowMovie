import { Plus } from 'lucide-react';

const TheaterHeader = ({ count, onAdd }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-white">Manage Theaters</h1>
      <p className="mt-1 text-sm text-gray-400">{count} theaters total</p>
    </div>
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
    >
      <Plus className="h-4 w-4" />
      Add Theater
    </button>
  </div>
);

export default TheaterHeader;

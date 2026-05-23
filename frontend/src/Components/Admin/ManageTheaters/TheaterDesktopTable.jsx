import { Building2, Edit3, Trash2 } from 'lucide-react';

const TheaterRow = ({ theater, onEdit, onDelete }) => (
  <tr className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/30">
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
          <Building2 className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="font-medium text-white">{theater.name}</p>
          {theater.featured && (
            <span className="text-xs font-medium text-red-400">Featured</span>
          )}
        </div>
      </div>
    </td>
    <td className="px-4 py-3.5 text-gray-400">
      {theater.location}, {theater.city}
    </td>
    <td className="px-4 py-3.5 text-gray-400">{theater.screens}</td>
    <td className="px-4 py-3.5">
      <span className="text-yellow-400 font-medium">{theater.rating}</span>
    </td>
    <td className="px-4 py-3.5">
      <div className="flex flex-wrap gap-1">
        {(theater.facilities || []).slice(0, 3).map((f) => (
          <span key={f} className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400 ring-1 ring-white/[0.04]">
            {f}
          </span>
        ))}
        {(theater.facilities?.length || 0) > 3 && (
          <span className="text-xs text-gray-500">+{theater.facilities.length - 3}</span>
        )}
      </div>
    </td>
    <td className="px-4 py-3.5 text-right">
      <div className="flex items-center justify-end gap-1.5">
        <button
          onClick={() => onEdit(theater)}
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(theater._id, theater.name)}
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);

const TheaterDesktopTable = ({ theaters, onEdit, onDelete }) => (
  <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-800">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-800 bg-gray-900/50">
          <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Name</th>
          <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Location</th>
          <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Screens</th>
          <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Rating</th>
          <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Facilities</th>
          <th className="px-4 py-3.5 text-right font-semibold text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {theaters.map((theater) => (
          <TheaterRow key={theater._id} theater={theater} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  </div>
);

export default TheaterDesktopTable;

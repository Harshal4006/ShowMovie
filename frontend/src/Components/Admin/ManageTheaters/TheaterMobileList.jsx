import { Building2, Edit3, Trash2 } from 'lucide-react';

const TheaterMobileCard = ({ theater, onEdit, onDelete }) => (
  <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-4 transition-colors hover:bg-gray-900/50">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
          <Building2 className="h-5 w-5 text-red-400" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-white truncate">{theater.name}</p>
          {theater.featured && (
            <span className="text-xs font-medium text-red-400">Featured</span>
          )}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
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
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
      <span className="flex items-center gap-1">
        {theater.location}, {theater.city}
      </span>
      <span className="flex items-center gap-1">
        {theater.screens} screens
      </span>
      <span className="flex items-center gap-1 text-yellow-400">
        ★ {theater.rating}
      </span>
    </div>

    {(theater.facilities || []).length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(theater.facilities || []).map((f) => (
          <span key={f} className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-[11px] text-gray-300">
            {f}
          </span>
        ))}
      </div>
    )}
  </div>
);

const TheaterMobileList = ({ theaters, onEdit, onDelete }) => (
  <div className="space-y-3 md:hidden">
    {theaters.map((theater) => (
      <TheaterMobileCard key={theater._id} theater={theater} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </div>
);

export default TheaterMobileList;

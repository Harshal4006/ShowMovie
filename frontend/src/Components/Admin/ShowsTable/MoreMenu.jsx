import { Eye, Edit2, Copy, Trash2 } from "lucide-react";

const MoreMenu = ({ show, anchorRect, onView, onEdit, onDuplicate, onDelete }) => {
  if (!show || !anchorRect) return null;

  return (
    <div
      className="fixed z-50 w-48 rounded-xl border border-gray-800 bg-gray-950 shadow-xl overflow-hidden"
      style={{
        top: anchorRect.bottom + 8,
        left: anchorRect.right - 192,
      }}
    >
      <button
        onClick={() => { onView(show.id); }}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-900"
      >
        <Eye size={16} className="text-gray-400" /> View
      </button>
      <button
        onClick={() => { onEdit(show); }}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-900"
      >
        <Edit2 size={16} className="text-gray-400" /> Edit
      </button>
      <button
        onClick={() => { if (onDuplicate) onDuplicate(show); }}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-900"
      >
        <Copy size={16} className="text-gray-400" /> Duplicate
      </button>
      <button
        onClick={() => { onDelete(show.id); }}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-900"
      >
        <Trash2 size={16} /> Delete
      </button>
    </div>
  );
};

export default MoreMenu;
import { Edit2, Trash2, Eye, MoreVertical, IndianRupee } from "lucide-react";

const getStatusBadge = (status) => {
  const statusConfig = {
    active: { label: "Active", className: "bg-green-500/10 text-green-400 border border-green-500/20" },
    inactive: { label: "Inactive", className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" },
    "sold-out": { label: "Sold Out", className: "bg-red-500/10 text-red-400 border border-red-500/20" },
    upcoming: { label: "Upcoming", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  };
  const config = statusConfig[status] || { label: status, className: "bg-gray-500/10 text-gray-400 border border-gray-500/20" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const TableRow = ({
  show,
  isSelected,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  onMoreClick,
}) => {
  return (
    <tr className="hover:bg-gray-800/30 transition-colors">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectRow(show.id)}
          className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600 focus:ring-offset-0 cursor-pointer"
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            {show.poster ? (
              <img src={show.poster} alt={show.movieName} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">N/A</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm">{show.movieName}</div>
            <div className="text-xs text-gray-500 hidden lg:block">{show.language} • {show.screenType}</div>
            <div className="xl:hidden">{getStatusBadge(show.status)}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="text-sm">{show.theater}</div>
        <div className="text-xs text-gray-500">Screen A1</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-sm">{show.date}</div>
        <div className="text-xs text-gray-500">{show.time}</div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center font-bold text-sm"><IndianRupee size={14} className="inline self-center" />{show.price}</div>
        <div className="text-xs text-gray-500">per seat</div>
      </td>
      <td className="px-4 py-4 hidden xl:table-cell">
        {getStatusBadge(show.status)}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(show.id)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(show)}
            className="p-2 rounded-lg text-blue-400 hover:bg-gray-800 hover:text-blue-300 transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(show.id)}
            className="p-2 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <div className="relative" data-more-root={`show-${show.id}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                onMoreClick(show.id, rect);
              }}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              title="More"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;

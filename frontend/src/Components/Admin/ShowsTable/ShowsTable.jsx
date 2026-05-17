import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import MoreMenu from "./MoreMenu";

const ShowsTable = ({
  shows,
  onEdit,
  onDelete,
  onView,
  selectedIds,
  onSelectedIdsChange,
  onDuplicate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMore, setOpenMore] = useState(null);
  const itemsPerPage = 5;

  const selectedRows = selectedIds ?? [];

  const setSelectedRows = (updater) => {
    const next = typeof updater === "function" ? updater(selectedRows) : updater;
    if (onSelectedIdsChange) onSelectedIdsChange(next);
  };

  const totalPages = Math.max(1, Math.ceil(shows.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShows = shows.slice(startIndex, endIndex);

  const selectedCount = selectedRows.length;
  const allSelected = shows.length > 0 && selectedCount === shows.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(shows.map((show) => show.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      onDelete(id);
      toast.success("Show deleted");
    }
  };

  const handleMoreClick = (id, anchorRect) => {
    setOpenMore((prev) => (prev?.id === id ? null : { id, anchorRect }));
  };

  useEffect(() => {
    if (!openMore) return;
    const onDocClick = (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest(`[data-more-root="show-${openMore.id}"]`)) return;
      setOpenMore(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openMore]);

  useEffect(() => {
    if (!openMore) return;
    const onChange = () => setOpenMore(null);
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [openMore]);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full min-w-150">
          <TableHeader
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-800">
            {paginatedShows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                  No shows found.
                </td>
              </tr>
            ) : (
              paginatedShows.map((show) => (
                <TableRow
                  key={show.id}
                  show={show}
                  isSelected={selectedRows.includes(show.id)}
                  onSelectRow={handleSelectRow}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  onMoreClick={handleMoreClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {openMore && (
        <MoreMenu
          show={shows.find((s) => s.id === openMore.id)}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ShowsTable;

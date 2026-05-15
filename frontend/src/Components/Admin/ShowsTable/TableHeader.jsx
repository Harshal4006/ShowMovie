const TableHeader = ({ allSelected, onSelectAll, selectedCount, showsLength }) => {
  return (
    <thead className="bg-gray-900/50">
      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <th className="px-4 py-4 w-10">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-red-600 focus:ring-red-600 focus:ring-offset-0 cursor-pointer"
          />
        </th>
        <th className="px-4 py-4">Movie</th>
        <th className="px-4 py-4 hidden lg:table-cell">Theater</th>
        <th className="px-4 py-4">Date & Time</th>
        <th className="px-4 py-4 hidden md:table-cell">Price</th>
        <th className="px-4 py-4 hidden xl:table-cell">Status</th>
        <th className="px-4 py-4">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
import React from "react";

const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse border-b border-gray-800">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 rounded-lg bg-gray-800" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-lg bg-gray-700" />
            <div className="h-3 w-20 rounded-lg bg-gray-800" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-24 rounded-lg bg-gray-700" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-20 rounded-lg bg-gray-700" />
      </td>
      <td className="py-4 px-4">
        <div className="h-6 w-20 rounded-full bg-gray-700" />
      </td>
      <td className="py-4 px-4">
        <div className="h-8 w-8 rounded-lg bg-gray-700" />
      </td>
    </tr>
  );
};

export default TableRowSkeleton;
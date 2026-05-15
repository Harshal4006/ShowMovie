import React from "react";

const FilterTabs = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: "all", label: "All Bookings", activeClass: "bg-red-500 text-white" },
    { key: "paid", label: "Paid", activeClass: "bg-green-500 text-white" },
    { key: "pending", label: "Pending", activeClass: "bg-yellow-500 text-white" },
  ];

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            currentFilter === filter.key
              ? filter.activeClass
              : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
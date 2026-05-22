import React from 'react';
import { Building2 } from 'lucide-react';

const TheaterEmptyState = ({ hasSearch }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Building2 className="mb-4 h-12 w-12 text-gray-600" />
    <h3 className="text-lg font-semibold text-white">No theaters found</h3>
    <p className="mt-2 text-sm text-gray-500">
      {hasSearch ? "Try a different search term" : "Get started by adding your first theater"}
    </p>
  </div>
);

export default TheaterEmptyState;

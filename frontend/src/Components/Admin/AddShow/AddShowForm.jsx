import { Info } from "lucide-react";
import ShowForm from "../ShowForm/ShowForm";

const AddShowForm = ({ onSubmit, initialData, isSubmitting }) => {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 p-5 sm:p-6">
      <div className="mb-6 pb-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Show Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          All fields marked with * are required.
        </p>
      </div>

      <ShowForm onSubmit={onSubmit} initialData={initialData} isSubmitting={isSubmitting} />

      {/* Help Tips */}
      <div className="mt-8 p-4 rounded-xl bg-gray-800/50 border border-gray-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
          <Info size={16} className="text-blue-400" />
          Tips for adding shows
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">•</span>
            Ensure the movie name matches the official title.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">•</span>
            Double-check date and time to avoid scheduling conflicts.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">•</span>
            Set appropriate pricing based on screen type and demand.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">•</span>
            Upload a high-quality poster for better user engagement.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddShowForm;
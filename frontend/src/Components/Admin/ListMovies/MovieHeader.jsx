import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieHeader = ({ onRefresh }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate("/admin")}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage Movies</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            View and edit movie sections (Featured, Trending, Most Popular)
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default MovieHeader;
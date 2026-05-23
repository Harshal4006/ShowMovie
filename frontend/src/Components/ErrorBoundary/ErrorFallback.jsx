import { memo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const ErrorFallback = ({ error, onReset }) => {
  const errorMessage = error?.message || "Something went wrong";

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-white">
          Oops! Something went wrong
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          {errorMessage}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-red-500/40 hover:bg-red-500/10"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-500"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          If this keeps happening, please refresh the page
        </p>
      </div>
    </div>
  );
};

const MemoErrorFallback = memo(ErrorFallback);
MemoErrorFallback.displayName = "ErrorFallback";
export default MemoErrorFallback;
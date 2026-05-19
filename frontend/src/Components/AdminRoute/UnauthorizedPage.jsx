import { Link } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <ShieldOff className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Access <span className="text-red-500">Denied</span>
        </h1>
        <p className="mt-4 text-base text-gray-400 sm:text-lg">
          You don't have permission to access this page.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This area is restricted to administrators only.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-500 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
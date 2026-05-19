import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { request } from "../../services/client.js";

const SetupAdmin = () => {
  const { getToken, isSignedIn } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!isSignedIn) {
      setResult({ error: "Please log in first on the main app." });
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const data = await request("/auth/setup-admin", { token });
      setResult(data);
    } catch (err) {
      setResult({ error: err.message || "Failed to setup admin" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
        <p className="text-gray-400 mb-8">Click below to grant yourself admin access.</p>

        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Grant Admin Access"}
        </button>

        {result && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {result?.isAdmin && (
          <div className="mt-6">
            <a
              href="/admin"
              className="rounded-xl bg-green-600 px-6 py-3 text-white font-bold hover:bg-green-500"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupAdmin;
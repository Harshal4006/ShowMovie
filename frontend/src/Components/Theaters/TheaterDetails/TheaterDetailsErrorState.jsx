import { Film, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TheaterDetailsErrorState = ({ error }) => {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
          <Film className="h-10 w-10 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-white">Theater Not Found</h1>
        <p className="mt-3 text-gray-500">{error || "The theater you're looking for doesn't exist."}</p>
        <button
          onClick={() => navigate("/theaters")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Theaters
        </button>
      </div>
    </section>
  );
};

export default TheaterDetailsErrorState;

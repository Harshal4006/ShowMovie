import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const TheatersFeaturedCard = ({ theater }) => {
  const navigate = useNavigate();

  if (!theater) return null;

  const handleExplore = () => {
    navigate(`/theaters/${theater._id}`);
  };

  const handleShowtimes = () => {
    if (theater._id) {
      navigate(`/theaters/${theater._id}?tab=shows`);
    } else {
      toast("Showtimes not available currently.");
    }
  };

  return (
    <div className="mt-10 mb-8 animate-fade-up animate-delay-100">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Featured Theater This Week</h2>
      </div>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_80px_rgba(239,68,68,0.12)]">
        <div className="relative h-56 sm:h-72">
          <img
            src={theater.image}
            alt={theater.name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-red-400">
              <Star className="h-4 w-4 fill-red-400" />
              <span>Featured</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {theater.name}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-gray-300 sm:text-base">
              {theater.description}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.97]"
              >
                Explore Now
              </button>
              <button
                onClick={handleShowtimes}
                className="w-full sm:w-auto rounded-2xl border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.97]"
              >
                View Showtimes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoTheatersFeaturedCard = memo(TheatersFeaturedCard);
MemoTheatersFeaturedCard.displayName = "TheatersFeaturedCard";
export default MemoTheatersFeaturedCard;

import React from 'react';
import { Sparkles, Star } from 'lucide-react';

const TheatersFeaturedCard = ({ theater }) => {
  if (!theater) return null;

  return (
    <div className="mt-10 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
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
            <div className="mt-4 flex gap-3">
              <button className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.97]">
                Explore Now
              </button>
              <button className="rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white active:scale-[0.97]">
                View Showtimes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheatersFeaturedCard;

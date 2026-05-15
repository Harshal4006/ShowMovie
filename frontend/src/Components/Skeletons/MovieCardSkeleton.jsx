import React from "react";

const MovieCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[1.9rem] border border-white/10 bg-white/4 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.26)]">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#0f1117]">
        <div className="aspect-16/10 bg-gradient-to-br from-gray-800 to-gray-900" />
        <div className="absolute right-3 top-3 h-10 w-10 rounded-full bg-gray-700" />
        <div className="absolute left-3 top-3 z-10 h-6 w-12 rounded-full bg-gray-700" />
      </div>

      <div className="relative px-2 pb-2 pt-5">
        <div className="h-7 w-3/4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800" />
        <div className="mt-3 h-4 w-1/2 rounded-xl bg-gray-800" />
        <div className="mt-2 h-4 w-1/3 rounded-xl bg-gray-800" />

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-800" />
          <div className="h-6 w-16 rounded-full bg-gray-800" />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-5">
          <div className="h-10 w-24 rounded-full bg-gray-800" />
          <div className="h-8 w-16 rounded-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
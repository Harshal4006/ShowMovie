import React from 'react';
import { Film } from 'lucide-react';

const TheatersHeroSection = () => (
  <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a0a] to-[#050505]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_70%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
    <div className="absolute inset-0 backdrop-blur-[2px]" />

    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 backdrop-blur-md ring-1 ring-red-500/10">
        <Film className="h-4 w-4" />
        Premium Cinemas
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Experience Cinema{" "}
        <span className="animate-gradient-text bg-gradient-to-r from-red-400 via-red-500 to-rose-600 bg-clip-text text-transparent">
          Beyond The Screen
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-base text-gray-400 sm:text-lg">
        Luxury theaters, immersive sound, and unforgettable movie nights.
      </p>
    </div>
  </div>
);

export default TheatersHeroSection;

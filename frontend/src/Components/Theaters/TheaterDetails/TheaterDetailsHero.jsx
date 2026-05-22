import React from 'react';
import { Star, MapPin, Monitor } from 'lucide-react';

const TheaterDetailsHero = ({ theater }) => (
  <div className="relative min-h-[420px] md:min-h-[560px] overflow-hidden pt-16 sm:pt-20">
    <img
      src={theater.image}
      alt={theater.name}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-black/40" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="max-w-[80%] mx-auto px-4 text-center">
        <div className="animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 backdrop-blur-sm ring-1 ring-red-500/10">
            <Star className="h-3.5 w-3.5 fill-red-400" />
            {theater.rating} Rating
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            {theater.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-red-500" />
              {theater.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Monitor className="h-4 w-4 text-red-500" />
              {theater.screens} Screens
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TheaterDetailsHero;

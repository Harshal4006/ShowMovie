import React from 'react';

const TheaterDetailsGallery = ({ gallery = [] }) => {
  if (gallery.length === 0) return null;

  return (
    <div className="animate-fade-up rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-6" style={{ animationDelay: "250ms" }}>
      <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-white">Gallery</h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {gallery.slice(0, 4).map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl">
            <img
              src={img}
              alt={`Gallery ${i + 1}`}
              className="h-24 sm:h-28 w-full object-cover transition-all duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-2 left-2 text-[10px] sm:text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Gallery {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterDetailsGallery;

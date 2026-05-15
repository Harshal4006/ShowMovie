import React from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const TrailerCarousel = ({ 
  leftTrailer, 
  centerTrailer, 
  rightTrailer, 
  isAnimating, 
  goToPrevious, 
  goToNext,
  dummyTrailers,
  activeIndex,
  setActiveIndex
}) => {
  return (
    <div className="relative mt-6 flex items-center justify-center sm:mt-8 lg:overflow-visible">
      <div className="absolute left-0 top-1/2 z-30 hidden w-[24%] -translate-y-1/2 items-center justify-center lg:flex">
        <button
          type="button"
          onClick={goToPrevious}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition duration-300 hover:border-red-500/40 hover:bg-red-500/18"
          aria-label="Previous trailer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="pointer-events-none absolute left-0 hidden w-[24%] lg:block">
        <div
          className={`transition-[transform,opacity,filter] duration-500 ease-in-out overflow-hidden rounded-[1.8rem] opacity-35 blur-[2px] ${
            isAnimating ? "is-animating-left" : ""
          }`}
        >
          <img
            src={leftTrailer.image}
            alt="Previous trailer preview"
            loading="lazy"
            className="h-92 w-full object-cover"
          />
        </div>
      </div>

      <div className="absolute right-0 top-1/2 z-30 hidden w-[24%] -translate-y-1/2 items-center justify-center lg:flex">
        <button
          type="button"
          onClick={goToNext}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white backdrop-blur shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition duration-300 hover:border-red-500/40 hover:bg-red-500/18"
          aria-label="Next trailer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="pointer-events-none absolute right-0 hidden w-[24%] lg:block">
        <div
          className={`transition-[transform,opacity,filter] duration-500 ease-in-out overflow-hidden rounded-[1.8rem] opacity-35 blur-[2px] ${
            isAnimating ? "is-animating-right" : ""
          }`}
        >
          <img
            src={rightTrailer.image}
            alt="Next trailer preview"
            loading="lazy"
            className="h-92 w-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl lg:overflow-visible">
        <a
          href={centerTrailer.videoUrl}
          target="_blank"
          rel="noreferrer"
          className={`group relative block overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-[transform,opacity,box-shadow] duration-500 ease-in-out sm:rounded-4xl sm:p-3 lg:overflow-visible ${
            isAnimating ? "is-animating" : ""
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl sm:rounded-3xl">
            <img
              src={centerTrailer.image}
              alt="Current trailer"
              loading="lazy"
              className={`trailer-main-image aspect-4/5 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.03] sm:aspect-16/10 lg:h-120 lg:aspect-auto ${
                isAnimating ? "is-animating" : ""
              }`}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                goToPrevious();
              }}
              className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition duration-300 hover:border-red-500/40 hover:bg-red-500/20 sm:left-4 sm:h-12 sm:w-12 lg:hidden"
              aria-label="Previous trailer"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                goToNext();
              }}
              className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition duration-300 hover:border-red-500/40 hover:bg-red-500/20 sm:right-4 sm:h-12 sm:w-12 lg:hidden"
              aria-label="Next trailer"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition duration-500 group-hover:scale-110 group-hover:bg-red-500/80 sm:h-18 sm:w-18">
                <Play className="ml-0.5 h-5 w-5 fill-white text-white sm:ml-1 sm:h-7 sm:w-7" />
              </div>
            </div>

            <div
              className={`trailer-main-content absolute bottom-0 left-0 right-0 p-4 transition-[transform,opacity] duration-500 ease-in-out sm:p-8 ${
                isAnimating ? "is-animating" : ""
              }`}
            >
              <h3 className="max-w-[75%] text-xl font-semibold text-white sm:max-w-none sm:text-3xl">
                {centerTrailer.title}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300 sm:mt-3 sm:max-w-2xl sm:text-base">
                Tap into the atmosphere, action, and emotion before you book your seat.
              </p>
            </div>
          </div>
        </a>

        <div className="mt-4 flex justify-center gap-2 lg:hidden">
          {dummyTrailers.map((trailer, index) => (
            <button
              key={trailer.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-red-500"
                  : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Show trailer ${trailer.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerCarousel;
import React, { useEffect, useState } from "react";
import { dummyTrailers } from "../../assets/assets.js";
import TrailerCarousel from "./TrailerCarousel.jsx";
import "./TrailerSection.css";

const TrailerSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = () => {
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? dummyTrailers.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === dummyTrailers.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const autoSlide = window.setInterval(() => {
      goToNext();
    }, 3500);

    return () => window.clearInterval(autoSlide);
  }, []);

  useEffect(() => {
    if (!isAnimating) return undefined;

    const timer = window.setTimeout(() => {
      setIsAnimating(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isAnimating]);

  const getVisibleTrailer = (offset) => {
    const index =
      (activeIndex + offset + dummyTrailers.length) % dummyTrailers.length;
    return dummyTrailers[index];
  };

  const leftTrailer = getVisibleTrailer(-1);
  const centerTrailer = getVisibleTrailer(0);
  const rightTrailer = getVisibleTrailer(1);

  return (
    <section data-reveal className="relative w-full overflow-hidden px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:overflow-visible lg:px-10 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-100 sm:text-4xl">
          Trending Trailers
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-gray-400 sm:mt-4 sm:text-base">
          Watch the latest previews and get a quick taste of the biggest stories heading to the big screen.
        </p>

        <TrailerCarousel
          leftTrailer={leftTrailer}
          centerTrailer={centerTrailer}
          rightTrailer={rightTrailer}
          isAnimating={isAnimating}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          dummyTrailers={dummyTrailers}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </section>
  );
};

export default TrailerSection;

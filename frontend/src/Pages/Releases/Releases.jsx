import { Loader2 } from 'lucide-react';
import useReleases from '../../Components/Releases/useReleases';
import { BACKDROP_BASE, POSTER_BASE, genresList, formatDate } from '../../Components/Releases/releasesUtils';
import HeroSection from '../../Components/Releases/HeroSection';
import UpcomingCarousel from '../../Components/Releases/UpcomingCarousel';
import TrendingGrid from '../../Components/Releases/TrendingGrid';
import ComingSoonGrid from '../../Components/Releases/ComingSoonGrid';
import GenreSection from '../../Components/Releases/GenreSection';

const Releases = () => {
  const {
    heroMovie, upcoming, trending, comingSoon, filteredMovies, selectedGenre,
    loading, trailerLoading, bookingLoading, scrollRef, isHovering, setIsHovering,
    handleGenreFilter, handleWatchTrailer, handleMovieClick, handleBookTickets, scroll,
  } = useReleases();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <HeroSection
        movie={heroMovie}
        trailerLoading={trailerLoading}
        bookingLoading={bookingLoading}
        onWatchTrailer={handleWatchTrailer}
        onBookTickets={handleBookTickets}
        backdropBase={BACKDROP_BASE}
        formatDate={formatDate}
        genresList={genresList}
      />

      <div className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1400px] mx-auto pb-20 mt-4 sm:mt-6 md:mt-8 lg:mt-10 relative z-10 space-y-10 sm:space-y-12 md:space-y-14">
        <UpcomingCarousel
          movies={upcoming}
          scrollRef={scrollRef}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          onMovieClick={handleMovieClick}
          posterBase={POSTER_BASE}
          formatDate={formatDate}
          onScroll={scroll}
        />

        <TrendingGrid
          movies={trending}
          onMovieClick={handleMovieClick}
          posterBase={POSTER_BASE}
          genresList={genresList}
        />

        <ComingSoonGrid
          movies={comingSoon}
          onMovieClick={handleMovieClick}
          posterBase={POSTER_BASE}
          formatDate={formatDate}
        />

        <GenreSection
          selectedGenre={selectedGenre}
          filteredMovies={filteredMovies}
          onGenreFilter={handleGenreFilter}
          onMovieClick={handleMovieClick}
          posterBase={POSTER_BASE}
          genresList={genresList}
        />
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Releases;

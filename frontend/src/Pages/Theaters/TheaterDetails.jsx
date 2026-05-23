import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useTheaterDetails from '../../Components/Theaters/TheaterDetails/useTheaterDetails.js';
import TheaterDetailsErrorState from '../../Components/Theaters/TheaterDetails/TheaterDetailsErrorState.jsx';
import TheaterDetailsHero from '../../Components/Theaters/TheaterDetails/TheaterDetailsHero.jsx';
import TheaterDetailsStatsStrip from '../../Components/Theaters/TheaterDetails/TheaterDetailsStatsStrip.jsx';
import TheaterDetailsFacilities from '../../Components/Theaters/TheaterDetails/TheaterDetailsFacilities.jsx';
import TheaterDetailsInfo from '../../Components/Theaters/TheaterDetails/TheaterDetailsInfo.jsx';
import TheaterDetailsGallery from '../../Components/Theaters/TheaterDetails/TheaterDetailsGallery.jsx';
import TheaterDetailsNowShowing from '../../Components/Theaters/TheaterDetails/TheaterDetailsNowShowing.jsx';

const TheaterDetails = () => {
  const { id } = useParams();
  const { theater, movies, loading, moviesLoading, error, moviesError } = useTheaterDetails(id);

  if (loading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </section>
    );
  }

  if (error || !theater) {
    return <TheaterDetailsErrorState error={error} />;
  }

  const showTimings = theater?.showTimings?.length > 0 ? theater.showTimings : undefined;
  const gallery = theater?.galleryImages?.filter(Boolean) || [];

  return (
    <section className="relative min-h-screen w-full overflow-x-hidden">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
      `}</style>

      <TheaterDetailsHero theater={theater} />
      <TheaterDetailsStatsStrip theater={theater} />

      <div className="px-4 sm:px-6 pb-20 mx-auto max-w-full sm:max-w-[80%]">
        <div className="mt-6 space-y-6 md:mt-0 md:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div className="space-y-6 lg:col-span-1">
            <TheaterDetailsFacilities facilities={theater.facilities} />
            <TheaterDetailsInfo theater={theater} />
            <TheaterDetailsGallery gallery={gallery} />
          </div>

          <TheaterDetailsNowShowing
            movies={movies}
            moviesLoading={moviesLoading}
            moviesError={moviesError}
            showTimings={showTimings}
          />
        </div>
      </div>
    </section>
  );
};

export default TheaterDetails;

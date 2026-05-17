import FeatureCard from "../FeatureSection/FeatureCard.jsx";

const RelatedMovies = ({ relatedMovies }) => {
  if (relatedMovies.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="mb-10 text-3xl font-bold text-white">You Might Also Like</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {relatedMovies.map((relatedMovie) => (
          <FeatureCard key={relatedMovie._id || relatedMovie.tmdbId || relatedMovie.id} movie={relatedMovie} />
        ))}
      </div>
    </div>
  );
};

export default RelatedMovies;

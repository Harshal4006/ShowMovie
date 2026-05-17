const CastGrid = ({ cast }) => {
  if (cast.length === 0) return null;

  const normalizeProfileImage = (value) => {
    if (!value || typeof value !== "string") return null;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return `https://image.tmdb.org/t/p/w200${value}`;
    return value;
  };

  const handleCastClick = (actorName) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(actorName)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-3xl font-bold text-white">Cast</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cast.slice(0, 12).map((actor, index) => (
          <div
            key={index}
            onClick={() => handleCastClick(actor.name)}
            className="group overflow-hidden rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/10 cursor-pointer"
          >
            <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-linear-to-br from-gray-900/90 to-gray-800/90">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
              <img
                src={
                  normalizeProfileImage(actor.profilePath || actor.profile_path) ||
                  "https://via.placeholder.com/300x450"
                }
                alt={actor.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-linear-to-t from-black/80 to-transparent">
                <p className="font-bold text-white text-lg">{actor.name}</p>
                <p className="text-sm text-gray-300 mt-1">{actor.character}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastGrid;

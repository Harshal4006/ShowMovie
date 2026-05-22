export const TMDB_IMG = "https://image.tmdb.org/t/p";
export const BACKDROP_BASE = `${TMDB_IMG}/w1280`;
export const POSTER_BASE = `${TMDB_IMG}/w500`;

export const genresList = ["Action", "Comedy", "Horror", "Sci-Fi", "Thriller", "Drama", "Romance", "Animation"];

export const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

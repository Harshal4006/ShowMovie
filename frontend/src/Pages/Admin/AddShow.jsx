import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import AddShowHeader from "../../Components/Admin/AddShow/AddShowHeader";
import AddShowForm from "../../Components/Admin/AddShow/AddShowForm";
import AddShowPreview from "../../Components/Admin/AddShow/AddShowPreview";
import { createShow, getTmdbMovieDetails } from "../../services/api";

const AddShow = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickAddData, setQuickAddData] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please sign in again (missing auth token).");
        return;
      }
      // Get full TMDB movie details to get genres, runtime, etc.
      let genres = [];
      let runtime = 0;
      let releaseDate = "";
      let tagline = "";
      let rating = 0;
      let voteCount = 0;
      let cast = [];
      let tmdbId = formData.movieId;

      if (tmdbId) {
        try {
          const details = await getTmdbMovieDetails(tmdbId);
          genres = details.genres || [];
          runtime = details.runtime || 0;
          releaseDate = details.releaseDate || "";
          tagline = details.tagline || "";
          rating = details.rating || details.vote_average || 0;
          voteCount = details.voteCount || details.vote_count || 0;
          cast = details.cast || [];
        } catch (e) {
          console.error("Failed to get TMDB details:", e);
        }
      }

      // Prepare show data - include movie details so it gets saved to Movie collection too
      const showDateTimes = (formData.showtimes || [])
        .filter((st) => st?.date && st?.time)
        // Force UTC to avoid timezone shifts between server/client.
        // We store showDateTime in Mongo as UTC and format back to local in UI.
        .map((st) => `${st.date}T${st.time}:00.000Z`);

      const showData = {
        movieName: formData.movieName,
        movieId: formData.movieId,
        moviePoster: formData.poster,
        movieBackdrop: formData.poster2,
        movieOverview: formData.description,
        showDateTimes,
        showPrice: formData.price,
        theater: formData.theater,
        screenType: formData.screenType,
        language: formData.language,
        genres: genres,
        runtime: runtime,
        releaseDate: releaseDate,
        tagline: tagline,
        rating: rating,
        voteCount: voteCount,
        cast: cast,
      };

      await createShow(token, showData);
      toast.success("Show added successfully!");
      navigate("/admin/list-shows");
    } catch (error) {
      console.error("Failed to create show:", error);
      toast.error(error?.message || "Failed to add show");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (data) => {
    setQuickAddData(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <AddShowHeader onQuickAdd={handleQuickAdd} />

          <AddShowForm onSubmit={handleSubmit} initialData={quickAddData || {}} />

          <AddShowPreview />

          {isSubmitting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-2xl bg-gray-900 border border-gray-800 p-8 text-center shadow-2xl">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-red-600" />
                <p className="text-lg font-semibold">Adding show...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait while we save the details.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddShow;

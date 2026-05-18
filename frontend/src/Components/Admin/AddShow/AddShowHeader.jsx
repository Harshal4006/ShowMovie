import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddShowHeader = ({ onQuickAdd }) => {
  const navigate = useNavigate();

  const handleQuickAdd = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const sampleData = {
      movieName: "",
      movieId: "",
      poster: "",
      poster2: "",
      theater: "Theater 1",
      showtimes: [{ date: tomorrowStr, time: "19:00" }],
      price: "",
      language: "English",
      screenType: "2D",
      description: "",
      status: "active"
    };

    onQuickAdd(sampleData);
    toast.success("Form pre-filled! Select a movie and complete the details.");
  };

  return (
    <div className="mb-6 lg:mb-8">
      <button
        onClick={() => navigate("/admin")}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Show</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Fill in the details below to schedule a new movie show.
          </p>
        </div>
        <button
          onClick={handleQuickAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Quick Add
        </button>
      </div>
    </div>
  );
};

export default AddShowHeader;
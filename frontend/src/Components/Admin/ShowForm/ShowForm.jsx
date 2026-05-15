import { useState } from "react";
import toast from "react-hot-toast";
import ShowFormFields from "./ShowFormFields";
import ShowtimesSection from "./ShowtimesSection";
import PosterUpload from "./PosterUpload";
import FormButtons from "./FormButtons";

const ShowForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    movieName: initialData.movieName || "",
    poster: initialData.poster || "",
    poster2: initialData.poster2 || "",
    theater: initialData.theater || "",
    showtimes: initialData.showtimes || [{ date: "", time: "" }],
    price: initialData.price || "",
    language: initialData.language || "",
    screenType: initialData.screenType || "",
    description: initialData.description || "",
    status: initialData.status || "active",
  });

  const [errors, setErrors] = useState({});

  // update form field and clear its error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // validate all required fields
  const validate = () => {
    const newErrors = {};
    if (!formData.movieName.trim()) newErrors.movieName = "Movie name is required";
    if (!formData.theater) newErrors.theater = "Theater is required";

    const invalidShowtimes = formData.showtimes.filter(st => !st.date || !st.time);
    if (invalidShowtimes.length > 0) {
      newErrors.showtimes = "All showtimes must have both date and time";
    }

    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.screenType) newErrors.screenType = "Screen type is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    onSubmit(formData);
    toast.success(isEditing ? "Show updated successfully!" : "Show added successfully!");
  };

  const handleClearForm = () => {
    setFormData({
      movieName: "",
      poster: "",
      poster2: "",
      theater: "",
      showtimes: [{ date: "", time: "" }],
      price: "",
      language: "",
      screenType: "",
      description: "",
      status: "active",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ShowFormFields
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />
        <ShowtimesSection
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      <PosterUpload formData={formData} setFormData={setFormData} />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
          placeholder="Enter movie description, cast, director, etc."
        />
      </div>

      <FormButtons isEditing={isEditing} onClear={handleClearForm} />
    </form>
  );
};

export default ShowForm;
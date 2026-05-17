import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const ImageUploadField = ({ label, imageKey, imageValue, onUpload, onRemove }) => (
  <div>
    <label className="mb-1 block text-xs text-gray-400">{label}</label>
    {imageValue ? (
      <div className="relative inline-block">
        <img
          src={imageValue}
          alt={`${label} preview`}
          loading="lazy"
          className="h-40 w-full rounded-lg object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(imageKey)}
          className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
        >
          <X size={16} />
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900 p-6">
        <div className="text-center">
          <Upload className="mx-auto mb-2 text-gray-500" size={24} />
          <p className="mb-2 text-xs text-gray-400">
            {imageKey === "poster" ? "Main Poster" : "Additional Poster"}
          </p>
          <label className="cursor-pointer rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium hover:bg-gray-700">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(e, imageKey)}
              className="hidden"
            />
          </label>
        </div>
      </div>
    )}
  </div>
);

const PosterUpload = ({ formData, setFormData }) => {
  const handleImageUpload = (e, imageType = "poster") => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, [imageType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageType = "poster") => {
    setFormData((prev) => ({ ...prev, [imageType]: "" }));
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">
        Movie Posters (Upload up to 2 images)
      </label>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ImageUploadField label="Poster 1 (Main)" imageKey="poster" imageValue={formData.poster} onUpload={handleImageUpload} onRemove={removeImage} />
        <ImageUploadField label="Poster 2 (Optional)" imageKey="poster2" imageValue={formData.poster2} onUpload={handleImageUpload} onRemove={removeImage} />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Upload two different posters for better presentation (e.g., vertical and horizontal)
      </p>
    </div>
  );
};

export default PosterUpload;

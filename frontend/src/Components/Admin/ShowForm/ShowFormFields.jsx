const theaters = ["PVR Cinemas", "INOX", "Cinepolis", "IMAX", "Wave Cinemas"];
const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada"];
const screenTypes = ["2D", "3D", "IMAX", "4DX", "Dolby Atmos", "Premium"];

const ShowFormFields = ({ formData, errors, handleChange }) => {
  return (
    <>
      {/* Movie Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Movie Name *</label>
        <input
          type="text"
          name="movieName"
          value={formData.movieName}
          onChange={handleChange}
          className={`w-full rounded-lg border ${errors.movieName ? "border-red-500" : "border-gray-700"} bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none`}
          placeholder="Enter movie name"
        />
        {errors.movieName && <p className="mt-1 text-sm text-red-500">{errors.movieName}</p>}
      </div>

      {/* Theater */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Theater *</label>
        <select
          name="theater"
          value={formData.theater}
          onChange={handleChange}
          className={`w-full rounded-lg border ${errors.theater ? "border-red-500" : "border-gray-700"} bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none`}
        >
          <option value="">Select theater</option>
          {theaters.map((th) => (
            <option key={th} value={th}>
              {th}
            </option>
          ))}
        </select>
        {errors.theater && <p className="mt-1 text-sm text-red-500">{errors.theater}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Price (₹) *</label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className={`w-full rounded-lg border ${errors.price ? "border-red-500" : "border-gray-700"} bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none`}
          placeholder="Enter ticket price"
        />
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>

      {/* Language */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Language *</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className={`w-full rounded-lg border ${errors.language ? "border-red-500" : "border-gray-700"} bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none`}
        >
          <option value="">Select language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        {errors.language && <p className="mt-1 text-sm text-red-500">{errors.language}</p>}
      </div>

      {/* Screen Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Screen Type *</label>
        <select
          name="screenType"
          value={formData.screenType}
          onChange={handleChange}
          className={`w-full rounded-lg border ${errors.screenType ? "border-red-500" : "border-gray-700"} bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none`}
        >
          <option value="">Select screen type</option>
          {screenTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.screenType && <p className="mt-1 text-sm text-red-500">{errors.screenType}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="sold-out">Sold Out</option>
        </select>
      </div>
    </>
  );
};

export default ShowFormFields;
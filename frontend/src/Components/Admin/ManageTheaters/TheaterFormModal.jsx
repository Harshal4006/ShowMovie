import React from 'react';

const TheaterFormModal = ({
  isOpen, editing, form, setForm, onSubmit, onClose,
}) => {
  if (!isOpen) return null;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setCheck = (key) => (e) => setForm({ ...form, [key]: e.target.checked });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-10">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {editing ? "Edit Theater" : "Add Theater"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Name *</label>
              <input
                required
                value={form.name}
                onChange={set("name")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">City *</label>
              <input
                required
                value={form.city}
                onChange={set("city")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Location *</label>
              <input
                required
                value={form.location}
                onChange={set("location")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={set("description")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Image URL (or paste base64/image URL)
              </label>
              <input
                value={form.image}
                onChange={set("image")}
                placeholder="https://example.com/theater.jpg"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Gallery Images (one URL per line)
              </label>
              <textarea
                rows={3}
                value={form.galleryImages}
                onChange={set("galleryImages")}
                placeholder="https://example.com/gallery1.jpg&#10;https://example.com/gallery2.jpg"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={set("rating")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Screens</label>
              <input
                type="number"
                min="1"
                value={form.screens}
                onChange={set("screens")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Facilities (comma-separated)
              </label>
              <input
                value={form.facilities}
                onChange={set("facilities")}
                placeholder="IMAX, Dolby Atmos, Recliner Seats, Parking"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Contact Number</label>
              <input
                value={form.contactNumber}
                onChange={set("contactNumber")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Opening Hours</label>
              <input
                value={form.openingHours}
                onChange={set("openingHours")}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Show Timings</label>
              <input
                value={form.showTimings}
                onChange={set("showTimings")}
                placeholder="10:00 AM, 1:30 PM, 4:00 PM"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={setCheck("featured")}
                  className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-300">Featured Theater</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:border-gray-700 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
            >
              {editing ? "Update Theater" : "Create Theater"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TheaterFormModal;

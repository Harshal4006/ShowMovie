import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Plus, Edit3, Trash2, Building2, Search } from "lucide-react";
import AdminSidebar from "../../Components/Admin/AdminSidebar/AdminSidebar";
import { getAdminTheaters, createTheater, updateTheater, deleteTheater } from "../../services/api";

const defaultForm = {
  name: "", location: "", city: "", description: "", image: "",
  galleryImages: "", rating: 0, screens: 1, facilities: "",
  contactNumber: "", email: "", openingHours: "10:00 AM - 11:45 PM",
  showTimings: "", featured: false,
};

const ManageTheaters = () => {
  const { getToken } = useAuth();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTheaters = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await getAdminTheaters(token);
      setTheaters(data.theaters || []);
    } catch (err) {
      toast.error("Failed to load theaters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTheaters(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (theater) => {
    setEditing(theater._id);
    setForm({
      name: theater.name,
      location: theater.location,
      city: theater.city,
      description: theater.description || "",
      image: theater.image || "",
      galleryImages: (theater.galleryImages || []).join("\n"),
      rating: theater.rating || 0,
      screens: theater.screens || 1,
      facilities: (theater.facilities || []).join(", "),
      contactNumber: theater.contactNumber || "",
      email: theater.email || "",
      openingHours: theater.openingHours || "10:00 AM - 11:45 PM",
      showTimings: (theater.showTimings || []).join(", "),
      featured: theater.featured || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const payload = {
        ...form,
        galleryImages: form.galleryImages ? form.galleryImages.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        facilities: form.facilities ? form.facilities.split(",").map((s) => s.trim()).filter(Boolean) : [],
        showTimings: form.showTimings ? form.showTimings.split(",").map((s) => s.trim()).filter(Boolean) : [],
        rating: Number(form.rating),
        screens: Number(form.screens),
      };

      if (editing) {
        await updateTheater(token, editing, payload);
        toast.success("Theater updated");
      } else {
        await createTheater(token, payload);
        toast.success("Theater created");
      }
      setShowForm(false);
      fetchTheaters();
    } catch (err) {
      toast.error(err?.message || "Failed to save theater");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const token = await getToken();
      await deleteTheater(token, id);
      setTheaters((prev) => prev.filter((t) => t._id !== id));
      toast.success("Theater deleted");
    } catch {
      toast.error("Failed to delete theater");
    }
  };

  const filtered = theaters.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <AdminSidebar />
      <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Theaters</h1>
              <p className="mt-1 text-sm text-gray-400">{theaters.length} theaters total</p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
            >
              <Plus className="h-4 w-4" />
              Add Theater
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search theaters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            </div>
          ) : filtered.length > 0 ? (
            <>
              {/* ─── Desktop Table ─── */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/50">
                      <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Name</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Location</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Screens</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Rating</th>
                      <th className="px-4 py-3.5 text-left font-semibold text-gray-300">Facilities</th>
                      <th className="px-4 py-3.5 text-right font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((theater) => (
                      <tr key={theater._id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/30">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                              <Building2 className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{theater.name}</p>
                              {theater.featured && (
                                <span className="text-xs font-medium text-red-400">Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          {theater.location}, {theater.city}
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">{theater.screens}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-yellow-400 font-medium">{theater.rating}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(theater.facilities || []).slice(0, 3).map((f) => (
                              <span key={f} className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400 ring-1 ring-white/[0.04]">
                                {f}
                              </span>
                            ))}
                            {(theater.facilities?.length || 0) > 3 && (
                              <span className="text-xs text-gray-500">+{theater.facilities.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(theater)}
                              className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(theater._id, theater.name)}
                              className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ─── Mobile Cards ─── */}
              <div className="space-y-3 md:hidden">
                {filtered.map((theater) => (
                  <div key={theater._id} className="rounded-2xl border border-gray-800 bg-gray-900/30 p-4 transition-colors hover:bg-gray-900/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                          <Building2 className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{theater.name}</p>
                          {theater.featured && (
                            <span className="text-xs font-medium text-red-400">Featured</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(theater)}
                          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(theater._id, theater.name)}
                          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        {theater.location}, {theater.city}
                      </span>
                      <span className="flex items-center gap-1">
                        {theater.screens} screens
                      </span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        ★ {theater.rating}
                      </span>
                    </div>

                    {(theater.facilities || []).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(theater.facilities || []).map((f) => (
                          <span key={f} className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-[11px] text-gray-300">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="mb-4 h-12 w-12 text-gray-600" />
              <h3 className="text-lg font-semibold text-white">No theaters found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? "Try a different search term" : "Get started by adding your first theater"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-10">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Theater" : "Add Theater"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">City *</label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Location *</label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Image URL (or paste base64/image URL)
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, galleryImages: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Screens</label>
                  <input
                    type="number"
                    min="1"
                    value={form.screens}
                    onChange={(e) => setForm({ ...form, screens: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Facilities (comma-separated)
                  </label>
                  <input
                    value={form.facilities}
                    onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                    placeholder="IMAX, Dolby Atmos, Recliner Seats, Parking"
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Contact Number</label>
                  <input
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Opening Hours</label>
                  <input
                    value={form.openingHours}
                    onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">Show Timings</label>
                  <input
                    value={form.showTimings}
                    onChange={(e) => setForm({ ...form, showTimings: e.target.value })}
                    placeholder="10:00 AM, 1:30 PM, 4:00 PM"
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-800 bg-gray-900 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-300">Featured Theater</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
      )}
    </div>
  );
};

export default ManageTheaters;

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { getAdminTheaters, createTheater, updateTheater, deleteTheater } from "../../../services/api";

const defaultForm = {
  name: "", location: "", city: "", description: "", image: "",
  galleryImages: "", rating: 0, screens: 1, facilities: "",
  contactNumber: "", email: "", openingHours: "10:00 AM - 11:45 PM",
  showTimings: "", featured: false,
};

const useTheaters = () => {
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
    } catch {
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

  return {
    theaters, loading, showForm, setShowForm, editing,
    form, setForm, searchTerm, setSearchTerm,
    filtered, openCreate, openEdit, handleSubmit, handleDelete,
  };
};

export default useTheaters;

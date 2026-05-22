import { useState, useEffect } from "react";
import { getTheaters } from "../../../services/api.js";

const allFacilities = ["IMAX", "Dolby Atmos", "4DX", "VIP Lounge", "Recliner Seats", "Parking", "Food Court"];

const useTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const data = await getTheaters();
        setTheaters(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load theaters");
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  const filtered = theaters.filter((t) => {
    const matchesSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase()) ||
      t.city?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || (t.facilities || []).includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const featuredTheater = theaters.find((t) => t.featured);
  const totalScreens = theaters.reduce((sum, t) => sum + (t.screens || 0), 0);

  return {
    theaters, loading, error, search, setSearch,
    activeFilter, setActiveFilter, filtered,
    featuredTheater, totalScreens, allFacilities,
  };
};

export default useTheaters;

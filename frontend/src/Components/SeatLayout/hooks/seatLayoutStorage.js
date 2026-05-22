const BOOKINGS_STORAGE_KEY = "showmovie:bookings";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

export const readBookings = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeBookings = (next) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("bookings:changed"));
};


// Generate seat ID from row letter and seat number
export const makeSeatId = (row, number) => `${row}${number}`;

// Build array of all seat IDs for given rows and seats per row
export const buildSeatIds = (rows, seatsPerRow) => {
  const all = [];
  for (const row of rows) {
    for (let n = 1; n <= seatsPerRow; n += 1) {
      all.push(makeSeatId(row, n));
    }
  }
  return all;
};

// Format date to Indian locale (e.g., "Mon, 1 Jan, 2026")
export const formatShowDate = (dateString) => {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Normalize time string: trim spaces and convert to uppercase
export const normalizeTimeString = (value) => {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim().toUpperCase();
};

// Convert AM/PM time string to minutes since midnight
export const timeToMinutes = (timeString) => {
  const normalized = normalizeTimeString(timeString);
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;
  const hoursRaw = Number(match[1]);
  const minutesRaw = Number(match[2]);
  const meridiem = match[3];

  if (!Number.isFinite(hoursRaw) || !Number.isFinite(minutesRaw)) return null;
  if (hoursRaw < 1 || hoursRaw > 12) return null;
  if (minutesRaw < 0 || minutesRaw > 59) return null;

  let hours = hoursRaw % 12;
  if (meridiem === "PM") hours += 12;
  return hours * 60 + minutesRaw;
};

// Convert ISO date time to formatted time label (e.g., "10:30 PM")
export const getShowTimeLabel = (isoDateTime) => {
  if (!isoDateTime) return "";
  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) return "";
  return normalizeTimeString(
    parsed.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

// Determine seat tier based on row letter
export const getSeatTier = (row) => {
  if (["A", "B", "C"].includes(row)) return "Premium";
  if (["D", "E", "F"].includes(row)) return "Standard";
  return "Economy";
};


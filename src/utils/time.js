// utils/timeUtils.js

// ========================================
// EXISTING UTILITIES (for displaying stored dates)
// ========================================

export function formatTimeRange(startISO, endISO) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const start = formatter.format(new Date(startISO));
  const end = formatter.format(new Date(endISO));
  return `${start} - ${end}`;
}

export function formatDate(dateISO) {
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(new Date(dateISO));
}

export function formatDuration(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let duration = "";
  if (hours > 0) {
    duration += `${hours}hr${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (duration) {
      duration += ", ";
    }
    duration += `${minutes}min`;
  }
  return duration;
}

// Helper function to format the date based on its proximity
export const formatSessionDate = (scheduledStart) => {
  const sessionDate = new Date(scheduledStart);
  const today = new Date();
  const oneWeekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Check if the session is within the next 7 days
  if (sessionDate >= today && sessionDate < oneWeekFromToday) {
    const weekday = sessionDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const time = sessionDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${weekday}, ${time}`;
  } else {
    // Format for beyond one week: "Month Dayth, Time"
    const month = sessionDate.toLocaleDateString("en-US", { month: "long" });
    const day = sessionDate.getDate();
    const time = sessionDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Add correct suffix for the day of the month (e.g., "st", "nd", "rd", "th")
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return `${month} ${day}${suffix}, ${time}`;
  }
};

/**
 * Converts a time difference in milliseconds into the largest appropriate unit.
 * @param {number} ms - The time difference in milliseconds.
 * @returns {string} A string like "5 days", "3 hours", or "10 minutes".
 */
export const formatTimeRemaining = (ms) => {
  // Define time constants in milliseconds
  const MS_PER_MINUTE = 1000 * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_WEEK = MS_PER_DAY * 7;

  // Find the largest whole unit
  let time;
  let unit;

  if (ms >= MS_PER_WEEK) {
    time = Math.ceil(ms / MS_PER_WEEK);
    unit = "week";
  } else if (ms >= MS_PER_DAY) {
    time = Math.ceil(ms / MS_PER_DAY);
    unit = "day";
  } else if (ms >= MS_PER_HOUR) {
    time = Math.ceil(ms / MS_PER_HOUR);
    unit = "hour";
  } else {
    // Default to minutes for anything less than an hour
    time = Math.ceil(ms / MS_PER_MINUTE);
    unit = "minute";
  }

  // Handle pluralization (e.g., "1 minute" vs "5 minutes")
  const plural = time === 1 ? "" : "s";
  return `${time} ${unit}${plural}`;
};

// ========================================
// NEW UTILITIES (for dropdown pickers)
// ========================================

// 🔹 Utility to format time for dropdown options
export const formatTime = (hour, minute) => {
  const h = ((hour + 11) % 12) + 1;
  const m = minute.toString().padStart(2, "0");
  const suffix = hour < 12 ? "AM" : "PM";
  return `${h}:${m} ${suffix}`;
};

// 🔹 Generate next 30 days for dropdown
export const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Use local date string instead of UTC conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const value = `${year}-${month}-${day}`;
    const label = date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    dates.push({ value, label });
  }
  return dates;
};

// 🔹 Generate 15-min slots from 6 AM – 10 PM for dropdown
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const value = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push({ value, label: formatTime(hour, minute) });
    }
  }
  return slots;
};

// 🔹 End time options relative to start for dropdown
export const getAvailableEndTimes = (startTime) => {
  if (!startTime) return [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;

  const endTimes = [];
  for (let duration = 15; duration <= 60; duration += 15) {
    const endTotalMinutes = startTotalMinutes + duration;
    if (endTotalMinutes >= 22 * 60) break;

    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;
    const value = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;
    endTimes.push({
      value,
      label: `${formatTime(endHour, endMinute)} (${duration} min session)`,
    });
  }
  return endTimes;
};

// 🔹 Calculate duration between start and end time strings
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

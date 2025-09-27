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

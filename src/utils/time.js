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

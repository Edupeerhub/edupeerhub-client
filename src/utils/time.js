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

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });

export function formatRelativeTime(timestamp: string, now = Date.now()) {
  const seconds = (new Date(timestamp).getTime() - now) / 1000;
  if (Number.isNaN(seconds)) return null;

  const match = UNITS.find(([, size]) => Math.abs(seconds) >= size);
  if (!match) return "há menos de um minuto";

  const [unit, size] = match;
  return formatter.format(Math.trunc(seconds / size), unit);
}

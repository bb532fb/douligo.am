export function startOfUtcDay(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function isSameUtcDay(left: Date, right: Date): boolean {
  return startOfUtcDay(left).getTime() === startOfUtcDay(right).getTime();
}

export function daysBetweenUtc(from: Date, to: Date): number {
  const start = startOfUtcDay(from).getTime();
  const end = startOfUtcDay(to).getTime();
  return Math.round((end - start) / 86_400_000);
}

export function startOfUtcWeek(date: Date = new Date()): Date {
  const day = startOfUtcDay(date);
  const weekday = day.getUTCDay();
  const mondayOffset = weekday === 0 ? 6 : weekday - 1;
  day.setUTCDate(day.getUTCDate() - mondayOffset);
  return day;
}

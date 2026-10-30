const timeCache = new Map<string, Intl.DateTimeFormat>()
const dateCache = new Map<string, Intl.DateTimeFormat>()
const keyCache = new Map<string, Intl.DateTimeFormat>()
const offsetCache = new Map<string, Intl.DateTimeFormat>()

function cached(
  cache: Map<string, Intl.DateTimeFormat>,
  tz: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${tz}|${JSON.stringify(options)}`
  let fmt = cache.get(key)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-GB', { ...options, timeZone: tz })
    cache.set(key, fmt)
  }
  return fmt
}

export function formatTime(ts: number, tz: string): string {
  return cached(timeCache, tz, { hour: '2-digit', minute: '2-digit', hour12: false }).format(ts)
}

export function formatDate(ts: number, tz: string): string {
  return cached(dateCache, tz, { weekday: 'short', day: 'numeric', month: 'short' }).format(ts)
}

export function formatDayMonth(ts: number, tz: string): string {
  return cached(dateCache, tz, { day: 'numeric', month: 'short' }).format(ts)
}

export function formatZoneOffset(ts: number, tz: string): string {
  const parts = cached(offsetCache, tz, { timeZoneName: 'shortOffset' }).formatToParts(ts)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
}

function localDateKey(ts: number, tz: string): string {
  const parts = cached(keyCache, tz, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(ts)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}

/** Whole-day difference between the local calendar dates of two instants. */
export function dayOffset(fromTs: number, fromTz: string, toTs: number, toTz: string): number {
  const a = Date.parse(`${localDateKey(fromTs, fromTz)}T00:00:00Z`)
  const b = Date.parse(`${localDateKey(toTs, toTz)}T00:00:00Z`)
  return Math.round((b - a) / 86_400_000)
}

export function formatDuration(totalMin: number): string {
  const mins = Math.max(0, Math.round(totalMin))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}

export function formatDistance(km: number): string {
  return `${formatNumber(km)} km`
}

export function formatSigned(value: number, suffix = ''): string {
  if (value === 0) return `0${suffix}`
  return `${value > 0 ? '+' : '−'}${formatNumber(Math.abs(value))}${suffix}`
}

export function relativeMinutes(min: number): string {
  const abs = Math.abs(Math.round(min))
  if (abs < 1) return 'now'
  return `${formatDuration(abs)}`
}

export function formatUtcClock(ts: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(ts)
}

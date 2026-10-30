import { geoDistance, geoInterpolate } from 'd3-geo'
import { getAirport } from '../data/airports'
import type { Flight } from '../data/flights'
import { SCHEDULE_BASE } from '../data/flights'

export type StatusTone = 'mint' | 'sky' | 'amber' | 'rose' | 'slate'

export type StatusKey =
  | 'scheduled'
  | 'boarding'
  | 'delayed'
  | 'climbing'
  | 'enroute'
  | 'descending'
  | 'landing'
  | 'landed'
  | 'cancelled'

export interface FlightStatus {
  key: StatusKey
  label: string
  tone: StatusTone
}

export interface FlightSnapshot {
  flight: Flight
  scheduledDep: number
  scheduledArr: number
  estimatedDep: number
  estimatedArr: number
  delayMin: number
  progress: number
  airborne: boolean
  onGround: boolean
  status: FlightStatus
  position: [number, number]
  altitudeFt: number
  speedKts: number
  verticalFpm: number
  heading: number
  distanceKm: number
  flownKm: number
  remainingKm: number
  remainingMin: number
  departureInMin: number
}

const CRUISE_POOL = [37000, 38000, 36000, 39000, 35000]

function hash(id: string): number {
  return [...id].reduce((acc, ch) => (acc * 33 + ch.charCodeAt(0)) % 100_003, 7)
}

export function cruiseAltitude(flight: Flight): number {
  return CRUISE_POOL[hash(flight.id) % CRUISE_POOL.length]
}

export function greatCircleKm(from: [number, number], to: [number, number]): number {
  return geoDistance(from, to) * 6371
}

export function flightDistanceKm(flight: Flight): number {
  const a = getAirport(flight.from)
  const b = getAirport(flight.to)
  return greatCircleKm([a.lon, a.lat], [b.lon, b.lat])
}

function bearingDeg(from: [number, number], to: [number, number]): number {
  const toRad = Math.PI / 180
  const lat1 = from[1] * toRad
  const lat2 = to[1] * toRad
  const dLon = (to[0] - from[0]) * toRad
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (Math.atan2(y, x) * 180) / Math.PI
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Position along the great circle at a given fraction of the flight. */
export function positionAt(flight: Flight, progress: number): [number, number] {
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const p = clamp01(progress)
  if (p <= 0) return [from.lon, from.lat]
  if (p >= 1) return [to.lon, to.lat]
  return geoInterpolate([from.lon, from.lat], [to.lon, to.lat])(p)
}

function altitudeAt(progress: number, cruise: number): number {
  if (progress <= 0 || progress >= 1) return 0
  if (progress < 0.055) return smooth(progress / 0.055) * cruise
  if (progress < 0.83) return cruise
  if (progress < 0.965) return lerp(cruise, 1800, smooth((progress - 0.83) / 0.135))
  return lerp(1800, 0, smooth((progress - 0.965) / 0.035))
}

function speedAt(progress: number, cruise: number): number {
  if (progress <= 0 || progress >= 1) return 0
  const cruiseSpeed = cruise >= 37000 ? 512 : 498
  if (progress < 0.06) return lerp(150, cruiseSpeed, smooth(progress / 0.06))
  if (progress < 0.84) return cruiseSpeed
  if (progress < 0.98) return lerp(cruiseSpeed, 155, smooth((progress - 0.84) / 0.14))
  return lerp(155, 0, (progress - 0.98) / 0.02)
}

export function statusFor(flight: Flight, now: number): FlightStatus {
  if (flight.cancelled) return { key: 'cancelled', label: 'Cancelled', tone: 'rose' }

  const scheduledDep = SCHEDULE_BASE + flight.depOffsetMin * 60_000
  const estimatedDep = scheduledDep + flight.delayMin * 60_000
  const durationMs = flight.durationMin * 60_000
  const estimatedArr = estimatedDep + durationMs

  if (now < estimatedDep) {
    if (flight.delayMin >= 15) return { key: 'delayed', label: 'Delayed', tone: 'amber' }
    if (estimatedDep - now <= 45 * 60_000) return { key: 'boarding', label: 'Boarding', tone: 'sky' }
    return { key: 'scheduled', label: 'On time', tone: 'mint' }
  }

  if (now >= estimatedArr) return { key: 'landed', label: 'Landed', tone: 'slate' }

  const progress = (now - estimatedDep) / durationMs
  if (progress < 0.055) return { key: 'climbing', label: 'Climbing', tone: 'sky' }
  if (progress < 0.84) return { key: 'enroute', label: 'In flight', tone: 'sky' }
  if (progress < 0.965) return { key: 'descending', label: 'Descending', tone: 'sky' }
  return { key: 'landing', label: 'Landing', tone: 'sky' }
}

export function snapshot(flight: Flight, now: number): FlightSnapshot {
  const scheduledDep = SCHEDULE_BASE + flight.depOffsetMin * 60_000
  const scheduledArr = scheduledDep + flight.durationMin * 60_000
  const durationMs = flight.durationMin * 60_000
  const estimatedDep = scheduledDep + flight.delayMin * 60_000
  const estimatedArr = estimatedDep + durationMs

  const status = statusFor(flight, now)
  const airborne = now >= estimatedDep && now < estimatedArr && !flight.cancelled
  const progress = flight.cancelled ? 0 : clamp01((now - estimatedDep) / durationMs)

  const distanceKm = flightDistanceKm(flight)
  const position: [number, number] = flight.cancelled
    ? (() => {
        const a = getAirport(flight.from)
        return [a.lon, a.lat]
      })()
    : positionAt(flight, progress)

  const cruise = cruiseAltitude(flight)
  const phase = now / 1000
  const altitudeFt = airborne ? Math.max(0, Math.round((altitudeAt(progress, cruise) + Math.sin(phase / 6) * 70) / 10) * 10) : 0
  const speedKts = airborne ? Math.max(0, Math.round(speedAt(progress, cruise) + Math.sin(phase / 5) * 3)) : 0

  // Vertical speed derived from the climb/descent profile.
  const dtMs = durationMs * 0.0004
  const altAhead = altitudeAt(progress + 0.0004, cruise)
  const altNow = altitudeAt(progress, cruise)
  const verticalFpm = airborne ? Math.round(((altAhead - altNow) / (dtMs / 60_000)) / 10) * 10 : 0

  const heading = (() => {
    if (!airborne) return 0
    const ahead = positionAt(flight, Math.min(1, progress + 0.002))
    const behind = positionAt(flight, Math.max(0, progress - 0.002))
    const b = bearingDeg(behind, ahead)
    return Math.round((b + 360) % 360)
  })()

  const remainingMin = Math.max(0, Math.round((estimatedArr - now) / 60_000))
  const departureInMin = Math.round((estimatedDep - now) / 60_000)

  return {
    flight,
    scheduledDep,
    scheduledArr,
    estimatedDep,
    estimatedArr,
    delayMin: flight.delayMin,
    progress,
    airborne,
    onGround: !airborne,
    status,
    position,
    altitudeFt,
    speedKts,
    verticalFpm,
    heading,
    distanceKm,
    flownKm: distanceKm * progress,
    remainingKm: distanceKm * (1 - progress),
    remainingMin,
    departureInMin,
  }
}

export function compass(heading: number): string {
  const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return points[Math.round(heading / 22.5) % 16]
}

/** Percent of the way from scheduled departure to scheduled arrival. */
export function scheduleProgress(flight: Flight, now: number): number {
  const dep = SCHEDULE_BASE + flight.depOffsetMin * 60_000
  const dur = flight.durationMin * 60_000
  return clamp01((now - dep) / dur)
}

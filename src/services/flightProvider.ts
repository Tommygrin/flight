import { AIRLINES, AIRPORT_MAP, type Airport } from '../data/airports'
import { FLIGHTS } from '../data/flights'
import type { Flight, FlightRecord, DataSourceStatus } from '../domain/models'

export interface FlightDataProvider {
  loadFlights(signal?: AbortSignal): Promise<FlightRecord[]>
  getStatus(): DataSourceStatus
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredText(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Flight data validation failed: ${key} must be a non-empty string.`)
  }
  return value.trim()
}

function finiteNumber(record: Record<string, unknown>, key: string, minimum: number): number {
  const value = record[key]
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum) {
    throw new Error(`Flight data validation failed: ${key} must be a finite number >= ${minimum}.`)
  }
  return value
}

/** Validate and normalize untrusted provider records before they enter UI state. */
export function normalizeFlights(input: unknown): FlightRecord[] {
  if (!Array.isArray(input)) throw new Error('Flight data validation failed: expected an array.')

  const ids = new Set<string>()
  return input.map((value, index) => {
    if (!isRecord(value)) throw new Error(`Flight data validation failed: record ${index + 1} is not an object.`)

    const id = requiredText(value, 'id').toUpperCase()
    const airlineCode = requiredText(value, 'airlineCode').toUpperCase()
    const from = requiredText(value, 'from').toUpperCase()
    const to = requiredText(value, 'to').toUpperCase()
    if (ids.has(id)) throw new Error(`Flight data validation failed: duplicate flight ${id}.`)
    if (!Object.hasOwn(AIRLINES, airlineCode)) throw new Error(`Flight data validation failed: unknown airline ${airlineCode}.`)
    if (!Object.hasOwn(AIRPORT_MAP, from) || !Object.hasOwn(AIRPORT_MAP, to)) {
      throw new Error(`Flight data validation failed: unknown airport on ${id}.`)
    }
    ids.add(id)

    const cancelled = value.cancelled === true
    const flight: Flight = {
      id,
      airlineCode,
      from,
      to,
      depOffsetMin: finiteNumber(value, 'depOffsetMin', -10_000),
      durationMin: finiteNumber(value, 'durationMin', 1),
      delayMin: finiteNumber(value, 'delayMin', 0),
      aircraft: requiredText(value, 'aircraft'),
      registration: requiredText(value, 'registration'),
      depTerminal: requiredText(value, 'depTerminal'),
      depGate: requiredText(value, 'depGate'),
      arrTerminal: requiredText(value, 'arrTerminal'),
      arrGate: requiredText(value, 'arrGate'),
      baggage: requiredText(value, 'baggage'),
      ...(cancelled ? { cancelled: true } : {}),
    }
    const origin = AIRPORT_MAP[from] as Airport
    const destination = AIRPORT_MAP[to] as Airport
    return {
      flight,
      aircraft: { type: flight.aircraft, registration: flight.registration },
      route: {
        origin,
        destination,
        coordinates: [[origin.lon, origin.lat], [destination.lon, destination.lat]],
      },
    }
  })
}

/** Fully local sample provider. Its status intentionally never claims live aircraft data. */
export const sampleFlightProvider: FlightDataProvider = {
  async loadFlights(signal) {
    if (signal?.aborted) throw new DOMException('The flight data request was cancelled.', 'AbortError')
    return normalizeFlights(FLIGHTS)
  },
  getStatus() {
    return {
      mode: 'demo',
      label: 'Demo data',
      source: 'SkyTrace sample schedule',
      lastUpdatedAt: null,
      stale: false,
      message: 'Schedules and aircraft positions are simulated locally; no live feed is connected.',
    }
  },
}

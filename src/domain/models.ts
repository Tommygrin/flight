import type { Airport } from '../data/airports'

export interface Flight {
  id: string
  airlineCode: string
  from: string
  to: string
  /** Scheduled departure, minutes from the session baseline (negative = departed). */
  depOffsetMin: number
  durationMin: number
  delayMin: number
  aircraft: string
  registration: string
  depTerminal: string
  depGate: string
  arrTerminal: string
  arrGate: string
  baggage: string
  cancelled?: boolean
}

export type Coordinate = readonly [longitude: number, latitude: number]

export interface Aircraft {
  type: string
  registration: string
}

export interface Route {
  origin: Airport
  destination: Airport
  coordinates: Coordinate[]
}

export interface FlightRecord {
  flight: Flight
  aircraft: Aircraft
  route: Route
}

export type DataMode = 'live' | 'delayed' | 'demo' | 'unavailable'

export interface DataSourceStatus {
  mode: DataMode
  label: string
  source: string
  lastUpdatedAt: number | null
  stale: boolean
  message: string
}

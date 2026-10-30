import { AIRLINES, getAirport } from './airports'

export interface Flight {
  id: string
  airlineCode: keyof typeof AIRLINES
  from: string
  to: string
  /** scheduled departure, minutes from session baseline (negative = already departed) */
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

/* Baseline is snapped to a 5-minute boundary so departure boards read naturally. */
const BASELINE = Math.ceil(Date.now() / 300_000) * 300_000

export const SCHEDULE_BASE = BASELINE

export const FLIGHTS: Flight[] = [
  // ── Lagos departures & arrivals ──────────────────────────────────────────
  {
    id: 'BA74', airlineCode: 'BA', from: 'LOS', to: 'LHR',
    depOffsetMin: -215, durationMin: 390, delayMin: 12,
    aircraft: 'Boeing 787-9', registration: 'G-ZBKA',
    depTerminal: 'T1', depGate: 'D7', arrTerminal: 'T5', arrGate: 'B36', baggage: '7',
  },
  {
    id: 'P47560', airlineCode: 'P4', from: 'LOS', to: 'LHR',
    depOffsetMin: -20, durationMin: 400, delayMin: 0,
    aircraft: 'Boeing 787-9', registration: '5N-BKK',
    depTerminal: 'T1', depGate: 'C4', arrTerminal: 'T3', arrGate: '22', baggage: '4',
  },
  {
    id: 'QR1412', airlineCode: 'QR', from: 'LOS', to: 'DOH',
    depOffsetMin: 95, durationMin: 415, delayMin: 0,
    aircraft: 'Airbus A350-900', registration: 'A7-ALN',
    depTerminal: 'T1', depGate: 'B2', arrTerminal: 'T1', arrGate: 'C12', baggage: '3',
  },
  {
    id: 'P47123', airlineCode: 'P4', from: 'LOS', to: 'ABV',
    depOffsetMin: 150, durationMin: 65, delayMin: 0,
    aircraft: 'Embraer E195', registration: '5N-BYE',
    depTerminal: 'T1', depGate: 'A3', arrTerminal: 'T1', arrGate: '1', baggage: '1',
  },
  {
    id: 'AT552', airlineCode: 'AT', from: 'LOS', to: 'CMN',
    depOffsetMin: 55, durationMin: 280, delayMin: 0,
    aircraft: 'Boeing 737-800', registration: 'CN-RGH',
    depTerminal: 'T1', depGate: 'D2', arrTerminal: 'T1', arrGate: '3', baggage: '2',
  },
  {
    id: 'MS876', airlineCode: 'MS', from: 'LOS', to: 'CAI',
    depOffsetMin: 240, durationMin: 330, delayMin: 0,
    aircraft: 'Airbus A320neo', registration: 'SU-GFN',
    depTerminal: 'T1', depGate: 'C6', arrTerminal: 'T3', arrGate: '5', baggage: '4',
  },
  {
    id: 'ET901', airlineCode: 'ET', from: 'ADD', to: 'LOS',
    depOffsetMin: -170, durationMin: 210, delayMin: 0,
    aircraft: 'Boeing 787-8', registration: 'ET-ARE',
    depTerminal: 'T2', depGate: '8', arrTerminal: 'T1', arrGate: 'D2', baggage: '5',
  },
  {
    id: 'KQ532', airlineCode: 'KQ', from: 'NBO', to: 'LOS',
    depOffsetMin: -395, durationMin: 330, delayMin: 0,
    aircraft: 'Boeing 737-800', registration: '5Y-CYA',
    depTerminal: '1A', depGate: '6', arrTerminal: 'T1', arrGate: 'C1', baggage: '2',
  },
  {
    id: 'KP22', airlineCode: 'KP', from: 'ACC', to: 'LOS',
    depOffsetMin: 35, durationMin: 55, delayMin: 0,
    aircraft: 'De Havilland Q400', registration: '9G-STA',
    depTerminal: 'T3', depGate: '4', arrTerminal: 'T1', arrGate: 'B8', baggage: '1',
  },
  {
    id: 'AT551', airlineCode: 'AT', from: 'CMN', to: 'LOS',
    depOffsetMin: -120, durationMin: 275, delayMin: 0,
    aircraft: 'Boeing 737-800', registration: 'CN-RGG',
    depTerminal: 'T1', depGate: '2', arrTerminal: 'T1', arrGate: 'D4', baggage: '4',
  },
  {
    id: 'MS875', airlineCode: 'MS', from: 'CAI', to: 'LOS',
    depOffsetMin: 85, durationMin: 330, delayMin: 0,
    aircraft: 'Airbus A320neo', registration: 'SU-GFO',
    depTerminal: 'T3', depGate: '4', arrTerminal: 'T1', arrGate: 'C5', baggage: '3',
  },

  {
    id: 'TK625', airlineCode: 'TK', from: 'LOS', to: 'IST',
    depOffsetMin: -30, durationMin: 380, delayMin: 0,
    aircraft: 'Airbus A330-300', registration: 'TC-JNM',
    depTerminal: 'T1', depGate: 'C2', arrTerminal: 'T1', arrGate: 'A6', baggage: '3',
  },
  {
    id: 'EK783', airlineCode: 'EK', from: 'LOS', to: 'DXB',
    depOffsetMin: 70, durationMin: 470, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'A6-EGK',
    depTerminal: 'T1', depGate: 'B5', arrTerminal: 'T3', arrGate: 'B18', baggage: '6',
  },
  {
    id: 'ET902', airlineCode: 'ET', from: 'LOS', to: 'ADD',
    depOffsetMin: 180, durationMin: 300, delayMin: 0,
    aircraft: 'Boeing 787-8', registration: 'ET-ARF',
    depTerminal: 'T1', depGate: 'D6', arrTerminal: 'T2', arrGate: '9', baggage: '2',
  },
  {
    id: 'KQ533', airlineCode: 'KQ', from: 'LOS', to: 'NBO',
    depOffsetMin: 265, durationMin: 330, delayMin: 0,
    aircraft: 'Boeing 737-800', registration: '5Y-CYB',
    depTerminal: 'T1', depGate: 'C3', arrTerminal: '1A', arrGate: '7', baggage: '4',
  },
  {
    id: 'BA75', airlineCode: 'BA', from: 'LHR', to: 'LOS',
    depOffsetMin: -300, durationMin: 400, delayMin: 0,
    aircraft: 'Boeing 777-200ER', registration: 'G-YMML',
    depTerminal: 'T5', depGate: 'B42', arrTerminal: 'T1', arrGate: 'D1', baggage: '8',
  },
  {
    id: 'EK781', airlineCode: 'EK', from: 'DXB', to: 'LOS',
    depOffsetMin: -400, durationMin: 460, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'A6-EGL',
    depTerminal: 'T3', depGate: 'B18', arrTerminal: 'T1', arrGate: 'D3', baggage: '5',
  },
  {
    id: 'TK624', airlineCode: 'TK', from: 'IST', to: 'LOS',
    depOffsetMin: -520, durationMin: 400, delayMin: 0,
    aircraft: 'Airbus A330-300', registration: 'TC-JNN',
    depTerminal: 'T1', depGate: 'A6', arrTerminal: 'T1', arrGate: 'C2', baggage: '3',
  },

  // ── Long haul ────────────────────────────────────────────────────────────
  {
    id: 'EK202', airlineCode: 'EK', from: 'JFK', to: 'DXB',
    depOffsetMin: -480, durationMin: 780, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: 'A6-EVB',
    depTerminal: 'T4', depGate: 'B22', arrTerminal: 'T3', arrGate: 'A7', baggage: '8',
  },
  {
    id: 'SQ317', airlineCode: 'SQ', from: 'LHR', to: 'SIN',
    depOffsetMin: -120, durationMin: 780, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: '9V-SKU',
    depTerminal: 'T2', depGate: 'B46', arrTerminal: 'T3', arrGate: 'A12', baggage: '44',
  },
  {
    id: 'QF12', airlineCode: 'QF', from: 'LAX', to: 'SYD',
    depOffsetMin: -610, durationMin: 900, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: 'VH-OQK',
    depTerminal: 'TB', depGate: '156', arrTerminal: 'T1', arrGate: '32', baggage: '9',
  },
  {
    id: 'EK1', airlineCode: 'EK', from: 'DXB', to: 'LHR',
    depOffsetMin: 40, durationMin: 460, delayMin: 35,
    aircraft: 'Airbus A380-800', registration: 'A6-EUA',
    depTerminal: 'T3', depGate: 'A4', arrTerminal: 'T3', arrGate: '34', baggage: '6',
  },
  {
    id: 'EK414', airlineCode: 'EK', from: 'DXB', to: 'SYD',
    depOffsetMin: -90, durationMin: 810, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: 'A6-EUD',
    depTerminal: 'T3', depGate: 'A12', arrTerminal: 'T1', arrGate: '58', baggage: '11',
  },
  {
    id: 'AA100', airlineCode: 'AA', from: 'JFK', to: 'LHR',
    depOffsetMin: -330, durationMin: 420, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'N718AN',
    depTerminal: 'T8', depGate: '14', arrTerminal: 'T3', arrGate: '22', baggage: '5',
  },
  {
    id: 'AF6', airlineCode: 'AF', from: 'CDG', to: 'JFK',
    depOffsetMin: 150, durationMin: 500, delayMin: 0,
    aircraft: 'Airbus A350-900', registration: 'F-HTYA',
    depTerminal: 'T2E', depGate: 'K42', arrTerminal: 'T1', arrGate: '6', baggage: '2',
  },
  {
    id: 'KL601', airlineCode: 'KL', from: 'AMS', to: 'LAX',
    depOffsetMin: 25, durationMin: 660, delayMin: 55,
    aircraft: 'Boeing 787-10', registration: 'PH-BKA',
    depTerminal: 'T2', depGate: 'E18', arrTerminal: 'TB', arrGate: '154', baggage: '3',
  },
  {
    id: 'TK3', airlineCode: 'TK', from: 'IST', to: 'JFK',
    depOffsetMin: -150, durationMin: 660, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'TC-JJV',
    depTerminal: 'T1', depGate: 'B14', arrTerminal: 'T1', arrGate: '8', baggage: '4',
  },
  {
    id: 'NH110', airlineCode: 'NH', from: 'HND', to: 'JFK',
    depOffsetMin: -60, durationMin: 750, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'JA791A',
    depTerminal: 'T3', depGate: '112', arrTerminal: 'T7', arrGate: '4', baggage: '6',
  },
  {
    id: 'CX880', airlineCode: 'CX', from: 'HKG', to: 'LAX',
    depOffsetMin: 200, durationMin: 760, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'B-KPA',
    depTerminal: 'T1', depGate: '62', arrTerminal: 'TB', arrGate: '148', baggage: '5',
  },
  {
    id: 'LH400', airlineCode: 'LH', from: 'FRA', to: 'JFK',
    depOffsetMin: -560, durationMin: 545, delayMin: 0,
    aircraft: 'Boeing 747-8', registration: 'D-ABYA',
    depTerminal: 'T1', depGate: 'B41', arrTerminal: 'T1', arrGate: '3', baggage: '7',
  },
  {
    id: 'DL14', airlineCode: 'DL', from: 'ATL', to: 'FRA',
    depOffsetMin: -700, durationMin: 540, delayMin: 0,
    aircraft: 'Airbus A330-900', registration: 'N401DZ',
    depTerminal: 'T2', depGate: 'F7', arrTerminal: 'T2', arrGate: 'D12', baggage: '4',
  },
  {
    id: 'CA981', airlineCode: 'CA', from: 'PEK', to: 'JFK',
    depOffsetMin: -240, durationMin: 800, delayMin: 0,
    aircraft: 'Boeing 747-8', registration: 'B-2485',
    depTerminal: 'T3', depGate: 'E18', arrTerminal: 'T1', arrGate: '2', baggage: '1',
  },
  {
    id: 'LA8085', airlineCode: 'LA', from: 'GRU', to: 'MAD',
    depOffsetMin: -400, durationMin: 590, delayMin: 0,
    aircraft: 'Boeing 787-9', registration: 'CC-BGI',
    depTerminal: 'T3', depGate: '312', arrTerminal: 'T4S', arrGate: 'S21', baggage: '6',
  },
  {
    id: 'KQ100', airlineCode: 'KQ', from: 'NBO', to: 'LHR',
    depOffsetMin: 320, durationMin: 540, delayMin: 0,
    aircraft: 'Boeing 787-8', registration: '5Y-KZA',
    depTerminal: '1A', depGate: '12', arrTerminal: 'T4', arrGate: '18', baggage: '2',
  },
  {
    id: 'ET700', airlineCode: 'ET', from: 'ADD', to: 'LHR',
    depOffsetMin: 120, durationMin: 480, delayMin: 0,
    aircraft: 'Airbus A350-900', registration: 'ET-ATR',
    depTerminal: 'T2', depGate: '6', arrTerminal: 'T2', arrGate: 'B33', baggage: '9',
  },
  {
    id: 'QR701', airlineCode: 'QR', from: 'DOH', to: 'JFK',
    depOffsetMin: -90, durationMin: 830, delayMin: 0,
    aircraft: 'Airbus A350-1000', registration: 'A7-ANA',
    depTerminal: 'T1', depGate: 'E3', arrTerminal: 'T8', arrGate: '10', baggage: '8',
  },
  {
    id: 'BA55', airlineCode: 'BA', from: 'LHR', to: 'JNB',
    depOffsetMin: 180, durationMin: 660, delayMin: 0, cancelled: true,
    aircraft: 'Airbus A380-800', registration: 'G-XLEA',
    depTerminal: 'T5', depGate: 'A10', arrTerminal: 'A', arrGate: '8', baggage: '9',
  },
  {
    id: 'EK2', airlineCode: 'EK', from: 'LHR', to: 'DXB',
    depOffsetMin: -350, durationMin: 420, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: 'A6-EUC',
    depTerminal: 'T3', depGate: '30', arrTerminal: 'T3', arrGate: 'A9', baggage: '7',
  },
  {
    id: 'EK201', airlineCode: 'EK', from: 'DXB', to: 'JFK',
    depOffsetMin: -240, durationMin: 840, delayMin: 0,
    aircraft: 'Airbus A380-800', registration: 'A6-EUE',
    depTerminal: 'T3', depGate: 'A8', arrTerminal: 'T4', arrGate: 'B20', baggage: '9',
  },
  {
    id: 'EK404', airlineCode: 'EK', from: 'SIN', to: 'DXB',
    depOffsetMin: -600, durationMin: 450, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'A6-ECX',
    depTerminal: 'T1', depGate: 'C1', arrTerminal: 'T3', arrGate: 'B7', baggage: '5',
  },
  {
    id: 'EK841', airlineCode: 'EK', from: 'DXB', to: 'DOH',
    depOffsetMin: 55, durationMin: 65, delayMin: 0,
    aircraft: 'Boeing 777-200LR', registration: 'A6-EWA',
    depTerminal: 'T3', depGate: 'A15', arrTerminal: 'T1', arrGate: 'C4', baggage: '2',
  },
  {
    id: 'QR4', airlineCode: 'QR', from: 'LHR', to: 'DOH',
    depOffsetMin: -200, durationMin: 400, delayMin: 0,
    aircraft: 'Airbus A350-1000', registration: 'A7-ANB',
    depTerminal: 'T4', depGate: '12', arrTerminal: 'T1', arrGate: 'C5', baggage: '4',
  },
  {
    id: 'QR870', airlineCode: 'QR', from: 'DOH', to: 'PVG',
    depOffsetMin: 60, durationMin: 540, delayMin: 0,
    aircraft: 'Boeing 777-300ER', registration: 'A7-BAA',
    depTerminal: 'T1', depGate: 'E2', arrTerminal: 'T2', arrGate: '45', baggage: '6',
  },
  {
    id: 'AF7', airlineCode: 'AF', from: 'JFK', to: 'CDG',
    depOffsetMin: -500, durationMin: 430, delayMin: 0,
    aircraft: 'Airbus A350-900', registration: 'F-HTYB',
    depTerminal: 'T1', depGate: '4', arrTerminal: 'T2E', arrGate: 'K45', baggage: '3',
  },
  {
    id: 'KQ101', airlineCode: 'KQ', from: 'LHR', to: 'NBO',
    depOffsetMin: -400, durationMin: 520, delayMin: 0,
    aircraft: 'Boeing 787-8', registration: '5Y-KZB',
    depTerminal: 'T4', depGate: '16', arrTerminal: '1A', arrGate: '8', baggage: '5',
  },
  {
    id: 'ET701', airlineCode: 'ET', from: 'LHR', to: 'ADD',
    depOffsetMin: -330, durationMin: 480, delayMin: 0,
    aircraft: 'Airbus A350-900', registration: 'ET-ATS',
    depTerminal: 'T2', depGate: 'B34', arrTerminal: 'T2', arrGate: '7', baggage: '8',
  },
]

export const FLIGHT_MAP: Record<string, Flight> = Object.fromEntries(
  FLIGHTS.map((f) => [f.id, f]),
)

export function getFlight(id: string): Flight {
  const flight = FLIGHT_MAP[id]
  if (!flight) throw new Error(`Unknown flight: ${id}`)
  return flight
}

export function routeLabel(flight: Flight): string {
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  return `${from.city} → ${to.city}`
}

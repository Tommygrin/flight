export interface Airport {
  code: string
  name: string
  city: string
  country: string
  tz: string
  lat: number
  lon: number
}

export const AIRPORTS: Airport[] = [
  { code: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos', lat: 6.5774, lon: 3.3212 },
  { code: 'ABV', name: 'Nnamdi Azikiwe', city: 'Abuja', country: 'Nigeria', tz: 'Africa/Lagos', lat: 9.0068, lon: 7.2632 },
  { code: 'ACC', name: 'Kotoka', city: 'Accra', country: 'Ghana', tz: 'Africa/Accra', lat: 5.6052, lon: -0.1668 },
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom', tz: 'Europe/London', lat: 51.47, lon: -0.4543 },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', tz: 'Europe/Paris', lat: 49.0097, lon: 2.5479 },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam', lat: 52.3105, lon: 4.7683 },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany', tz: 'Europe/Berlin', lat: 50.0379, lon: 8.5622 },
  { code: 'MUC', name: 'Munich', city: 'Munich', country: 'Germany', tz: 'Europe/Berlin', lat: 48.3538, lon: 11.7861 },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Spain', tz: 'Europe/Madrid', lat: 40.4983, lon: -3.5676 },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Spain', tz: 'Europe/Madrid', lat: 41.2974, lon: 2.0833 },
  { code: 'FCO', name: 'Fiumicino', city: 'Rome', country: 'Italy', tz: 'Europe/Rome', lat: 41.8003, lon: 12.2389 },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Türkiye', tz: 'Europe/Istanbul', lat: 41.2753, lon: 28.7519 },
  { code: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'Switzerland', tz: 'Europe/Zurich', lat: 47.4647, lon: 8.5492 },
  { code: 'VIE', name: 'Schwechat', city: 'Vienna', country: 'Austria', tz: 'Europe/Vienna', lat: 48.1103, lon: 16.5697 },
  { code: 'BRU', name: 'Brussels', city: 'Brussels', country: 'Belgium', tz: 'Europe/Brussels', lat: 50.9014, lon: 4.4844 },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', tz: 'Europe/Dublin', lat: 53.4213, lon: -6.2701 },
  { code: 'LIS', name: 'Humberto Delgado', city: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon', lat: 38.7742, lon: -9.1342 },
  { code: 'CPH', name: 'Kastrup', city: 'Copenhagen', country: 'Denmark', tz: 'Europe/Copenhagen', lat: 55.618, lon: 12.6508 },
  { code: 'ARN', name: 'Arlanda', city: 'Stockholm', country: 'Sweden', tz: 'Europe/Stockholm', lat: 59.6519, lon: 17.9186 },
  { code: 'OSL', name: 'Gardermoen', city: 'Oslo', country: 'Norway', tz: 'Europe/Oslo', lat: 60.1939, lon: 11.1004 },
  { code: 'HEL', name: 'Vantaa', city: 'Helsinki', country: 'Finland', tz: 'Europe/Helsinki', lat: 60.3172, lon: 24.9633 },
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'United States', tz: 'America/New_York', lat: 40.6413, lon: -73.7781 },
  { code: 'BOS', name: 'Logan', city: 'Boston', country: 'United States', tz: 'America/New_York', lat: 42.3656, lon: -71.0096 },
  { code: 'MIA', name: 'Miami', city: 'Miami', country: 'United States', tz: 'America/New_York', lat: 25.7959, lon: -80.287 },
  { code: 'ATL', name: 'Hartsfield–Jackson', city: 'Atlanta', country: 'United States', tz: 'America/New_York', lat: 33.6407, lon: -84.4277 },
  { code: 'ORD', name: "O'Hare", city: 'Chicago', country: 'United States', tz: 'America/Chicago', lat: 41.9742, lon: -87.9073 },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'United States', tz: 'America/Chicago', lat: 32.8998, lon: -97.0403 },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles', lat: 33.9416, lon: -118.4085 },
  { code: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'United States', tz: 'America/Los_Angeles', lat: 37.6213, lon: -122.379 },
  { code: 'SEA', name: 'Sea-Tac', city: 'Seattle', country: 'United States', tz: 'America/Los_Angeles', lat: 47.4502, lon: -122.3088 },
  { code: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', tz: 'America/Toronto', lat: 43.6777, lon: -79.6248 },
  { code: 'MEX', name: 'Benito Juárez', city: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City', lat: 19.4361, lon: -99.0719 },
  { code: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo', lat: -23.4356, lon: -46.4731 },
  { code: 'EZE', name: 'Ezeiza', city: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires', lat: -34.8222, lon: -58.5358 },
  { code: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile', tz: 'America/Santiago', lat: -33.393, lon: -70.7858 },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', tz: 'America/Lima', lat: -12.0219, lon: -77.1143 },
  { code: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia', tz: 'America/Bogota', lat: 4.7016, lon: -74.1469 },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', tz: 'Asia/Dubai', lat: 25.2532, lon: 55.3657 },
  { code: 'AUH', name: 'Zayed International', city: 'Abu Dhabi', country: 'UAE', tz: 'Asia/Dubai', lat: 24.433, lon: 54.6511 },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', tz: 'Asia/Qatar', lat: 25.2731, lon: 51.6081 },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', lat: 24.9576, lon: 46.6988 },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', tz: 'Asia/Riyadh', lat: 21.6796, lon: 39.1565 },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', tz: 'Asia/Jerusalem', lat: 32.0114, lon: 34.8867 },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo', lat: 30.1219, lon: 31.4056 },
  { code: 'ADD', name: 'Bole', city: 'Addis Ababa', country: 'Ethiopia', tz: 'Africa/Addis_Ababa', lat: 8.9779, lon: 38.7993 },
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi', lat: -1.3192, lon: 36.9278 },
  { code: 'JNB', name: 'O. R. Tambo', city: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg', lat: -26.1367, lon: 28.2411 },
  { code: 'CPT', name: 'Cape Town', city: 'Cape Town', country: 'South Africa', tz: 'Africa/Johannesburg', lat: -33.9648, lon: 18.6017 },
  { code: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Morocco', tz: 'Africa/Casablanca', lat: 33.3675, lon: -7.5898 },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', lat: 1.3644, lon: 103.9915 },
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'Hong Kong', tz: 'Asia/Hong_Kong', lat: 22.308, lon: 113.9185 },
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', lat: 35.5494, lon: 139.7798 },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', lat: 35.772, lon: 140.3929 },
  { code: 'ICN', name: 'Incheon', city: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', lat: 37.4602, lon: 126.4407 },
  { code: 'PEK', name: 'Capital', city: 'Beijing', country: 'China', tz: 'Asia/Shanghai', lat: 40.0799, lon: 116.6031 },
  { code: 'PVG', name: 'Pudong', city: 'Shanghai', country: 'China', tz: 'Asia/Shanghai', lat: 31.1443, lon: 121.8083 },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok', lat: 13.69, lon: 100.7501 },
  { code: 'KUL', name: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', lat: 2.7456, lon: 101.7099 },
  { code: 'CGK', name: 'Soekarno–Hatta', city: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta', lat: -6.1256, lon: 106.6559 },
  { code: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines', tz: 'Asia/Manila', lat: 14.5086, lon: 121.0194 },
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'India', tz: 'Asia/Kolkata', lat: 28.5562, lon: 77.1 },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', lat: 19.0896, lon: 72.8656 },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', lat: -33.9399, lon: 151.1753 },
  { code: 'MEL', name: 'Tullamarine', city: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne', lat: -37.669, lon: 144.841 },
  { code: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland', lat: -37.0082, lon: 174.785 },
]

export const AIRPORT_MAP: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, a]),
)

export function getAirport(code: string): Airport {
  const airport = AIRPORT_MAP[code]
  if (!airport) throw new Error(`Unknown airport: ${code}`)
  return airport
}

export interface Airline {
  code: string
  name: string
  brand: string
  callsign: string
}

export const AIRLINES: Record<string, Airline> = {
  BA: { code: 'BA', name: 'British Airways', brand: '#2f6fb3', callsign: 'SPEEDBIRD' },
  EK: { code: 'EK', name: 'Emirates', brand: '#d7382f', callsign: 'EMIRATES' },
  SQ: { code: 'SQ', name: 'Singapore Airlines', brand: '#e0a63c', callsign: 'SINGAPORE' },
  QF: { code: 'QF', name: 'Qantas', brand: '#d1332e', callsign: 'QANTAS' },
  QR: { code: 'QR', name: 'Qatar Airways', brand: '#7d2248', callsign: 'QATARI' },
  P4: { code: 'P4', name: 'Air Peace', brand: '#17846a', callsign: 'PEACE' },
  ET: { code: 'ET', name: 'Ethiopian Airlines', brand: '#2c8a4b', callsign: 'ETHIOPIAN' },
  KQ: { code: 'KQ', name: 'Kenya Airways', brand: '#a3243c', callsign: 'KENYA' },
  KP: { code: 'KP', name: 'ASKY Airlines', brand: '#c98a2e', callsign: 'ASKY' },
  LH: { code: 'LH', name: 'Lufthansa', brand: '#b58a2b', callsign: 'LUFTHANSA' },
  AF: { code: 'AF', name: 'Air France', brand: '#2c4f8f', callsign: 'AIRFRANS' },
  KL: { code: 'KL', name: 'KLM', brand: '#2fa3d6', callsign: 'KLM' },
  AA: { code: 'AA', name: 'American Airlines', brand: '#5b6b7d', callsign: 'AMERICAN' },
  DL: { code: 'DL', name: 'Delta Air Lines', brand: '#8f2233', callsign: 'DELTA' },
  TK: { code: 'TK', name: 'Turkish Airlines', brand: '#c0313a', callsign: 'TURKISH' },
  NH: { code: 'NH', name: 'All Nippon Airways', brand: '#26539b', callsign: 'ALL NIPPON' },
  CX: { code: 'CX', name: 'Cathay Pacific', brand: '#1f6b57', callsign: 'CATHAY' },
  CA: { code: 'CA', name: 'Air China', brand: '#b3352f', callsign: 'AIR CHINA' },
  LA: { code: 'LA', name: 'LATAM', brand: '#9b2c3f', callsign: 'LAN' },
  AT: { code: 'AT', name: 'Royal Air Maroc', brand: '#8f2d3c', callsign: 'ROYALAIR MAROC' },
  MS: { code: 'MS', name: 'EgyptAir', brand: '#2d5e9b', callsign: 'EGYPTAIR' },
  WB: { code: 'WB', name: 'RwandAir', brand: '#2d7a63', callsign: 'RWANDAIR' },
}

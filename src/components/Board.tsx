import { useMemo, useState } from 'react'
import { AIRLINES, getAirport } from '../data/airports'
import type { Flight } from '../domain/models'
import {
  dayOffset,
  formatDate,
  formatTime,
  formatUtcClock,
  formatZoneOffset,
} from '../lib/format'
import { snapshot, statusFor, type FlightSnapshot } from '../lib/flight'
import { StatusPill } from './ui'

interface BoardProps {
  now: number
  airportCode: string
  tab: Tab
  allSnapshots: FlightSnapshot[]
  flights: Flight[]
  onSelectAirport: (code: string) => void
  onSelectFlight: (id: string) => void
  onTabChange: (tab: Tab) => void
}

const BOARD_AIRPORTS = ['LOS', 'LHR', 'JFK', 'DXB', 'DOH', 'CDG', 'ADD', 'NBO']

export type Tab = 'departures' | 'arrivals'

/** Boards speak in airport language: departures say "Departed", arrivals say "On time". */
function boardStatus(flight: Flight, now: number, tab: Tab) {
  const status = statusFor(flight, now)
  if (tab === 'departures') {
    if (status.key === 'climbing') return { ...status, label: 'Departed' }
    if (status.key === 'enroute' || status.key === 'descending' || status.key === 'landing') {
      return { ...status, label: 'In flight' }
    }
    return status
  }
  if (status.key === 'boarding' || status.key === 'scheduled') return { ...status, label: 'On time' }
  if (status.key === 'climbing' || status.key === 'enroute') return { ...status, label: 'In flight' }
  return status
}

function weatherFor(code: string) {
  const seed = [...code].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const conditions = ['Clear', 'Partly cloudy', 'Light rain', 'Hazy']
  return {
    temp: 18 + (seed % 16),
    condition: conditions[seed % conditions.length],
    variant: seed % conditions.length,
    wind: 6 + (seed % 19),
  }
}

function WeatherIcon({ variant }: { variant: number }) {
  return (
    <svg className="weather-icon" viewBox="0 0 32 32" aria-hidden="true">
      {(variant === 0 || variant === 1 || variant === 3) && (
        <g>
          <circle cx={variant === 1 ? 12 : 16} cy={variant === 1 ? 11 : 13} r={variant === 1 ? 4.6 : 5.4} fill="#ffc978" />
          {variant !== 1 && (
            <g stroke="#ffc978" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
              <path d="M16 3.4v2.6M16 20v2.6M6.4 13h2.6M23 13h2.6M9.2 6.2l1.9 1.9M21 18l1.9 1.9M22.8 6.2 21 8.1M11 18l-1.8 1.9" />
            </g>
          )}
        </g>
      )}
      {(variant === 1 || variant === 2) && (
        <path
          d="M9.4 24h13.2a4.1 4.1 0 0 0 .4-8.2 6.2 6.2 0 0 0-11.7 1.3A3.7 3.7 0 0 0 9.4 24Z"
          fill={variant === 2 ? '#a9bccf' : '#c3d3e2'}
          opacity={variant === 2 ? 0.95 : 0.9}
        />
      )}
      {variant === 2 && (
        <g stroke="#6ec8ff" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 26.6 11 29.2M16.6 26.6l-1 2.6M21.2 26.6l-1 2.6" />
        </g>
      )}
      {variant === 3 && (
        <g stroke="#93a9bd" strokeWidth="1.7" strokeLinecap="round" opacity="0.8">
          <path d="M7 22.4h18M9 25.6h14M11 28.4h10" />
        </g>
      )}
    </svg>
  )
}

export default function Board({
  now,
  airportCode,
  tab,
  allSnapshots,
  flights,
  onSelectAirport,
  onSelectFlight,
  onTabChange,
}: BoardProps) {
  const airport = getAirport(airportCode)
  const [airlineFilter, setAirlineFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = useMemo(() => {
    const list = flights.filter((flight) =>
      tab === 'departures' ? flight.from === airportCode : flight.to === airportCode,
    ).map((flight) => {
      const snap = allSnapshots.find((s) => s.flight.id === flight.id) ?? snapshot(flight, now)
      const time = tab === 'departures' ? snap.estimatedDep : snap.estimatedArr
      return { flight, snap, time }
    })
    return list
      .filter(({ flight }) => airlineFilter === 'all' || flight.airlineCode === airlineFilter)
      .filter(({ flight }) => {
        if (statusFilter === 'all') return true
        const key = statusFor(flight, now).key
        if (statusFilter === 'in-flight') return ['climbing', 'enroute', 'descending', 'landing'].includes(key)
        return key === statusFilter
      })
      .sort((a, b) => a.time - b.time)
  }, [airportCode, tab, allSnapshots, flights, now, airlineFilter, statusFilter])

  const stats = useMemo(() => {
    const base = flights.filter((f) => (tab === 'departures' ? f.from : f.to) === airportCode)
    const states = base.map((flight) => statusFor(flight, now))
    return {
      total: base.length,
      onTime: states.filter((s) => s.key === 'scheduled' || s.key === 'boarding').length,
      airborne: states.filter((s) => ['climbing', 'enroute', 'descending', 'landing'].includes(s.key)).length,
      delayed: states.filter((s) => s.key === 'delayed').length,
      cancelled: states.filter((s) => s.key === 'cancelled').length,
      landed: states.filter((s) => s.key === 'landed').length,
    }
  }, [airportCode, tab, now, flights])

  const weather = weatherFor(airportCode)

  return (
    <div className="view-enter">
      <div className="view-head">
        <div>
          <p className="eyebrow">Airport board</p>
          <h2>
            {airport.city} <span className="view-head-muted">{tab === 'departures' ? 'departures' : 'arrivals'}</span>
          </h2>
          <p className="view-sub">
            {airport.name} · {airport.code} · {airport.country}
          </p>
        </div>
        <span className="live-tag">
          <span className="demo-dot" />
          <span>Demo data</span>
          <span className="live-tag-sub">sample schedule</span>
        </span>
      </div>

      <div className="airport-chips" role="tablist" aria-label="Select airport">
        {BOARD_AIRPORTS.map((code) => {
          const a = getAirport(code)
          return (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={code === airportCode}
              className={`airport-chip-btn ${code === airportCode ? 'is-active' : ''}`}
              onClick={() => onSelectAirport(code)}
            >
              <span className="chip-code">{code}</span>
              <span className="chip-city">{a.city}</span>
            </button>
          )
        })}
      </div>

      <div className="board-layout">
        <section className="card board-card">
          <div className="board-toolbar">
            <div className="segmented" role="tablist" aria-label="Departures or arrivals">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'departures'}
                className={tab === 'departures' ? 'is-active' : ''}
                onClick={() => onTabChange('departures')}
              >
                Departures
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'arrivals'}
                className={tab === 'arrivals' ? 'is-active' : ''}
                onClick={() => onTabChange('arrivals')}
              >
                Arrivals
              </button>
            </div>
            <div className="board-filters">
              <label>
                <span className="sr-only">Filter by airline</span>
                <select aria-label="Filter by airline" value={airlineFilter} onChange={(event) => setAirlineFilter(event.target.value)}>
                  <option value="all">All airlines</option>
                  {[...new Set(flights.map((flight) => flight.airlineCode))].sort().map((code) => (
                    <option key={code} value={code}>{AIRLINES[code]?.name ?? code}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter by status</span>
                <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="scheduled">On time</option>
                  <option value="boarding">Boarding</option>
                  <option value="delayed">Delayed</option>
                  <option value="in-flight">In flight</option>
                  <option value="landed">Landed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <span className="board-hint">{rows.length} flights · local times</span>
            </div>
          </div>

          <div className="board-table" role="table" aria-label={`${airport.city} ${tab}`}>
            <div className="board-row board-row-head" role="row">
              <span role="columnheader">Time</span>
              <span role="columnheader">Flight</span>
              <span role="columnheader">{tab === 'departures' ? 'Destination' : 'Origin'}</span>
              <span role="columnheader">Term.</span>
              <span role="columnheader">Gate</span>
              <span role="columnheader">Status</span>
            </div>

            {rows.length === 0 ? (
              <div className="board-empty">
                <span>{airlineFilter !== 'all' || statusFilter !== 'all' ? 'No flights match these filters at this airport.' : 'No flights scheduled at this airport right now.'}</span>
                {(airlineFilter !== 'all' || statusFilter !== 'all') && (
                  <button type="button" onClick={() => { setAirlineFilter('all'); setStatusFilter('all') }}>Clear filters</button>
                )}
              </div>
            ) : (
              rows.map(({ flight, time }) => {
                const airline = AIRLINES[flight.airlineCode]
                const city = getAirport(tab === 'departures' ? flight.to : flight.from)
                const shift = dayOffset(now, airport.tz, time, airport.tz)
                return (
                  <button
                    key={flight.id}
                    type="button"
                    role="row"
                    className="board-row board-row-body"
                    onClick={() => onSelectFlight(flight.id)}
                  >
                    <span className="board-time" role="cell">
                      {formatTime(time, airport.tz)}
                      {shift > 0 && <sup className="day-shift">+{shift}</sup>}
                      {flight.delayMin > 0 && (
                        <span className="row-delay">+{flight.delayMin}m</span>
                      )}
                    </span>
                    <span className="board-flight" role="cell">
                      <span
                        className="airline-chip is-sm"
                        style={{ background: `${airline.brand}22`, color: airline.brand }}
                      >
                        {airline.code}
                      </span>
                      <span className="board-flight-id">{flight.id}</span>
                    </span>
                    <span className="board-city" role="cell">
                      <strong>{city.city}</strong>
                      <span>{city.code}</span>
                    </span>
                    <span className="board-cell" role="cell">
                      {tab === 'departures' ? flight.depTerminal : flight.arrTerminal}
                    </span>
                    <span className="board-cell board-gate" role="cell">
                      {tab === 'departures' ? flight.depGate : flight.arrGate}
                    </span>
                    <span className="board-status" role="cell">
                      <StatusPill status={boardStatus(flight, now, tab)} size="sm" />
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </section>

        <aside className="board-side">
          <section className="card airport-card">
            <div className="airport-card-top">
              <div>
                <p className="eyebrow">{airport.country}</p>
                <h3>{airport.city}</h3>
                <p className="airport-name">{airport.name}</p>
              </div>
              <span className="airport-code-big">{airport.code}</span>
            </div>

            <div className="airport-clock">
              <strong>{formatTime(now, airport.tz)}</strong>
              <span>
                {formatDate(now, airport.tz)} · {formatZoneOffset(now, airport.tz)}
              </span>
            </div>

            <div className="airport-weather">
              <WeatherIcon variant={weather.variant} />
              <div>
                <strong>{weather.temp}°C</strong>
                <span>{weather.condition} · wind {weather.wind} km/h</span>
              </div>
            </div>

            <dl className="airport-facts">
              <div>
                <dt>Local timezone</dt>
                <dd>{airport.tz.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt>Coordinates</dt>
                <dd className="mono">
                  {Math.abs(airport.lat).toFixed(2)}°{airport.lat >= 0 ? 'N' : 'S'} ·{' '}
                  {Math.abs(airport.lon).toFixed(2)}°{airport.lon >= 0 ? 'E' : 'W'}
                </dd>
              </div>
              <div>
                <dt>UTC now</dt>
                <dd className="mono">{formatUtcClock(now)}</dd>
              </div>
            </dl>
          </section>

          <section className="card board-summary">
            <div className="card-head">
              <h2>Board status</h2>
            </div>
            <div className="summary-grid">
              <div>
                <span className="summary-value">{stats.total}</span>
                <span className="summary-label">Flights</span>
              </div>
              <div>
                <span className="summary-value is-mint">{stats.onTime}</span>
                <span className="summary-label">On time</span>
              </div>
              <div>
                <span className="summary-value is-sky">{stats.airborne}</span>
                <span className="summary-label">In air</span>
              </div>
              <div>
                <span className="summary-value is-amber">{stats.delayed}</span>
                <span className="summary-label">Delayed</span>
              </div>
              <div>
                <span className="summary-value is-rose">{stats.cancelled}</span>
                <span className="summary-label">Cancelled</span>
              </div>
              <div>
                <span className="summary-value is-slate">{stats.landed}</span>
                <span className="summary-label">Landed</span>
              </div>
            </div>
            <p className="board-summary-note">
              {stats.airborne > 0
                ? `${stats.airborne} ${tab === 'departures' ? 'departure' : 'arrival'}${stats.airborne === 1 ? '' : 's'} currently in the air.`
                : 'No flights currently in the air for this board.'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

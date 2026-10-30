import { AIRLINES, getAirport } from '../data/airports'
import type { Flight } from '../domain/models'
import { snapshot, type FlightSnapshot } from '../lib/flight'
import {
  dayOffset,
  formatDayMonth,
  formatDistance,
  formatDuration,
  formatTime,
} from '../lib/format'
import { PlaneGlyph, StarButton, StatusPill } from './ui'
import { formatFlightNo } from './FlightHero'

interface WatchlistProps {
  now: number
  watchlist: string[]
  flights: Flight[]
  onSelectFlight: (id: string) => void
  onToggleWatch: (id: string) => void
}

const SUGGESTIONS = ['EK202', 'QF12', 'SQ317', 'QR701']

function WatchCard({
  snap,
  watched,
  onTrack,
  onToggle,
}: {
  snap: FlightSnapshot
  watched: boolean
  onTrack: () => void
  onToggle: () => void
}) {
  const { flight, status } = snap
  const airline = AIRLINES[flight.airlineCode]
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const shift = dayOffset(snap.estimatedDep, from.tz, snap.estimatedArr, to.tz)

  return (
    <article className="watch-card card">
      <div className="watch-head">
        <span
          className="airline-chip"
          style={{ background: `${airline.brand}22`, color: airline.brand }}
        >
          {airline.code}
        </span>
        <div className="watch-id">
          <strong>{formatFlightNo(flight.id)}</strong>
          <span>{airline.name}</span>
        </div>
        <StarButton active={watched} onClick={onToggle} />
      </div>

      <div className="watch-route">
        <div>
          <strong>{from.code}</strong>
          <span>{formatTime(snap.estimatedDep, from.tz)}</span>
          <span className="watch-date">{formatDayMonth(snap.estimatedDep, from.tz)}</span>
        </div>
        <div className="watch-route-mid">
          <span className="watch-duration">{formatDuration(flight.durationMin)}</span>
          <span className="watch-line">
            <span style={{ width: `${Math.max(snap.progress * 100, 2)}%` }}>
              <PlaneGlyph className="watch-plane" />
            </span>
          </span>
          <span className="watch-distance">{formatDistance(snap.distanceKm)}</span>
        </div>
        <div className="watch-dest">
          <strong>{to.code}</strong>
          <span>
            {formatTime(snap.estimatedArr, to.tz)}
            {shift > 0 && <sup className="day-shift">+{shift}</sup>}
          </span>
          <span className="watch-date">{formatDayMonth(snap.estimatedArr, to.tz)}</span>
        </div>
      </div>

      <div className="watch-meta">
        <StatusPill status={status} size="sm" />
        <span className="watch-aircraft">{flight.aircraft}</span>
      </div>

      <button type="button" className="watch-track" onClick={onTrack}>
        Track flight
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

export default function Watchlist({ now, watchlist, flights: allFlights, onSelectFlight, onToggleWatch }: WatchlistProps) {
  const flights = watchlist
    .map((id) => allFlights.find((flight) => flight.id === id))
    .filter((flight): flight is Flight => Boolean(flight))

  const suggestions = SUGGESTIONS.filter((id) => !watchlist.includes(id))
    .map((id) => allFlights.find((flight) => flight.id === id))
    .filter((flight): flight is Flight => Boolean(flight))
    .slice(0, 3)

  return (
    <div className="view-enter">
      <div className="view-head">
        <div>
          <p className="eyebrow">Saved flights</p>
          <h2>
            Watchlist <span className="view-head-muted">{flights.length}</span>
          </h2>
          <p className="view-sub">Flights you have saved on this device. Sample schedules advance on a simulation clock.</p>
        </div>
        <span className="live-tag">
          <span className="demo-dot" />
          <span>Demo data</span>
          <span className="live-tag-sub">sample schedule</span>
        </span>
      </div>

      {flights.length === 0 ? (
        <section className="card empty-state">
          <span className="empty-icon" aria-hidden="true">☆</span>
          <h3>Your watchlist is empty</h3>
          <p>
            Star a flight while tracking it and it will appear here, with simulated status and a quick
            route summary.
          </p>
          <div className="empty-actions">
            {suggestions.map((flight) => {
              const from = getAirport(flight.from)
              const to = getAirport(flight.to)
              return (
                <button
                  key={flight.id}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => onToggleWatch(flight.id)}
                >
                  <strong>{flight.id}</strong>
                  <span>{from.code} → {to.code}</span>
                </button>
              )
            })}
          </div>
        </section>
      ) : (
        <>
          <div className="watch-grid">
            {flights.map((flight) => (
              <WatchCard
                key={flight.id}
                snap={snapshot(flight, now)}
                watched
                onTrack={() => onSelectFlight(flight.id)}
                onToggle={() => onToggleWatch(flight.id)}
              />
            ))}
          </div>

          {suggestions.length > 0 && (
            <section className="suggest-strip">
              <div>
                <p className="eyebrow">Add more</p>
                <h3>Popular flights right now</h3>
              </div>
              <div className="suggest-list">
                {suggestions.map((flight) => {
                  const from = getAirport(flight.from)
                  const to = getAirport(flight.to)
                  const status = snapshot(flight, now).status
                  return (
                    <button
                      key={flight.id}
                      type="button"
                      className="suggest-card"
                      onClick={() => onToggleWatch(flight.id)}
                    >
                      <span className="suggest-id">{flight.id}</span>
                      <span className="suggest-route">{from.city} → {to.city}</span>
                      <span className={`suggest-status tone-${status.tone}`}>{status.label}</span>
                      <span className="suggest-add" aria-hidden="true">+</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

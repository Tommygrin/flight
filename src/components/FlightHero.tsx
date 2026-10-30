import { AIRLINES, getAirport } from '../data/airports'
import type { FlightSnapshot } from '../lib/flight'
import {
  dayOffset,
  formatDistance,
  formatDuration,
  formatTime,
  formatZoneOffset,
} from '../lib/format'
import { PlaneGlyph, StarButton, StatusPill } from './ui'

interface FlightHeroProps {
  snap: FlightSnapshot
  watched: boolean
  onToggleWatch: () => void
}

export function formatFlightNo(id: string): string {
  const match = /^([A-Z0-9]{2})(\d+)$/.exec(id)
  return match ? `${match[1]} ${match[2]}` : id
}

export default function FlightHero({ snap, watched, onToggleWatch }: FlightHeroProps) {
  const { flight, status } = snap
  const airline = AIRLINES[flight.airlineCode]
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const dayShift = dayOffset(snap.estimatedDep, from.tz, snap.estimatedArr, to.tz)
  const landed = status.key === 'landed'
  const cancelled = Boolean(flight.cancelled)

  const centerNote = cancelled
    ? 'Flight cancelled'
    : landed
      ? `Arrived ${formatTime(snap.estimatedArr, to.tz)} local`
      : snap.airborne
        ? `${formatDuration(snap.remainingMin)} to arrival`
        : snap.departureInMin > 0
          ? `Departs in ${formatDuration(snap.departureInMin)}`
          : 'Departing shortly'

  return (
    <section className="hero card">
      <div className="hero-top">
        <div className="hero-id">
          <span
            className="airline-badge"
            style={{
              background: `linear-gradient(150deg, ${airline.brand} 0%, ${airline.brand}99 55%, #0b1826 150%)`,
            }}
            aria-hidden="true"
          >
            {airline.code}
          </span>
          <div className="hero-id-text">
            <p className="hero-eyebrow">
              {airline.name} <span className="sep">·</span> {flight.aircraft}{' '}
              <span className="sep">·</span> {flight.registration}
            </p>
            <div className="hero-title-row">
              <h1>{formatFlightNo(flight.id)}</h1>
              <StatusPill status={status} />
              {snap.delayMin > 0 && !flight.cancelled && (
                <span className="delay-chip">+{snap.delayMin} min</span>
              )}
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <span className={`live-tag ${landed || cancelled ? 'is-idle' : ''}`}>
            <span className="demo-dot" />
            <span>{cancelled ? 'Not operating' : landed ? 'Schedule complete' : 'Demo tracking'}</span>
            <span className="live-tag-sub">simulated feed</span>
          </span>
          <StarButton active={watched} onClick={onToggleWatch} />
        </div>
      </div>

      <div className="hero-route">
        <div className="port">
          <span className="port-code">{from.code}</span>
          <span className="port-city">{from.city}</span>
          <span className="port-time">
            {formatTime(snap.estimatedDep, from.tz)}
            <em>{formatZoneOffset(snap.estimatedDep, from.tz)}</em>
          </span>
          <span className="port-note">
            {snap.delayMin > 0 && !snap.airborne
              ? `Scheduled ${formatTime(snap.scheduledDep, from.tz)} · Terminal ${flight.depTerminal}`
              : `Terminal ${flight.depTerminal} · Gate ${flight.depGate}`}
          </span>
        </div>

        <div className="route-mid">
          <div className="route-topline">
            <span>{formatDuration(flight.durationMin)} block</span>
            <span>{formatDistance(snap.distanceKm)}</span>
          </div>
          <div className="route-track" role="img" aria-label={`${Math.round(snap.progress * 100)} percent of route complete`}>
            <span className="route-rail" />
            <span
              className="route-fill"
              style={{ width: cancelled ? 0 : `${snap.progress * 100}%` }}
            />
            <span className="route-origin" />
            <span className="route-dest" />
            {!cancelled && (
              <span className="route-plane" style={{ left: `clamp(2%, ${snap.progress * 100}%, 98%)` }}>
                <PlaneGlyph />
              </span>
            )}
          </div>
          <div className="route-bottomline">
            <span>{centerNote}</span>
            <span>
              ETA {formatTime(snap.estimatedArr, to.tz)}
              {dayShift > 0 && <sup className="day-shift">+{dayShift}</sup>}
            </span>
          </div>
        </div>

        <div className="port port-arr">
          <span className="port-code">{to.code}</span>
          <span className="port-city">{to.city}</span>
          <span className="port-time">
            {formatTime(snap.estimatedArr, to.tz)}
            {dayShift > 0 && <sup className="day-shift">+{dayShift}</sup>}
            <em>{formatZoneOffset(snap.estimatedArr, to.tz)}</em>
          </span>
          <span className="port-note">
            Terminal {flight.arrTerminal} · Gate {flight.arrGate}
          </span>
        </div>
      </div>
    </section>
  )
}

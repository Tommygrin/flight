import { AIRLINES, getAirport } from '../data/airports'
import type { FlightSnapshot } from '../lib/flight'
import { compass, cruiseAltitude, flightDistanceKm } from '../lib/flight'
import {
  formatDistance,
  formatDuration,
  formatNumber,
  formatSigned,
  formatTime,
  formatZoneOffset,
} from '../lib/format'

export function GatesCard({ snap }: { snap: FlightSnapshot }) {
  const { flight } = snap
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)

  return (
    <section className="card side-card">
      <div className="card-head">
        <h2>Gates &amp; terminals</h2>
        <span className="card-head-note">{flight.aircraft}</span>
      </div>

      <div className="gate-row">
        <span className="gate-tag">DEP</span>
        <div className="gate-route">
          <strong>{from.code}</strong>
          <span>
            {formatTime(snap.estimatedDep, from.tz)} {formatZoneOffset(snap.estimatedDep, from.tz)}
          </span>
        </div>
        <div className="gate-cell">
          <span>Terminal</span>
          <strong>{flight.depTerminal}</strong>
        </div>
        <div className="gate-cell">
          <span>Gate</span>
          <strong>{flight.depGate}</strong>
        </div>
      </div>

      <div className="gate-row">
        <span className="gate-tag">ARR</span>
        <div className="gate-route">
          <strong>{to.code}</strong>
          <span>
            {formatTime(snap.estimatedArr, to.tz)} {formatZoneOffset(snap.estimatedArr, to.tz)}
          </span>
        </div>
        <div className="gate-cell">
          <span>Terminal</span>
          <strong>{flight.arrTerminal}</strong>
        </div>
        <div className="gate-cell">
          <span>Gate</span>
          <strong>{flight.arrGate}</strong>
        </div>
      </div>

      <div className="gate-extra">
        <span>
          Baggage belt <strong>{flight.baggage}</strong>
        </span>
        <span>
          Block time <strong>{formatDuration(flight.durationMin)}</strong>
        </span>
        <span>
          Delay{' '}
          <strong className={snap.delayMin > 0 ? 'is-warn' : ''}>
            {snap.delayMin > 0 ? `+${snap.delayMin} min` : 'None'}
          </strong>
        </span>
      </div>
    </section>
  )
}

export function TelemetryCard({ snap }: { snap: FlightSnapshot }) {
  const vertical = snap.verticalFpm
  const verticalIcon = vertical > 120 ? '↑' : vertical < -120 ? '↓' : '→'
  const verticalClass = vertical > 120 ? 'is-up' : vertical < -120 ? 'is-down' : ''

  return (
    <section className="card side-card">
      <div className="card-head">
        <h2>Live telemetry</h2>
        <span className={`card-head-note ${snap.airborne ? 'is-live' : ''}`}>
          {snap.airborne ? 'streaming' : 'on ground'}
        </span>
      </div>
      <div className="telemetry-grid">
        <div className="telemetry-tile">
          <span>Altitude</span>
          <strong>
            {snap.airborne ? formatNumber(snap.altitudeFt) : '—'} <em>ft</em>
          </strong>
        </div>
        <div className="telemetry-tile">
          <span>Ground speed</span>
          <strong>
            {snap.airborne ? formatNumber(snap.speedKts) : '—'} <em>kts</em>
          </strong>
        </div>
        <div className="telemetry-tile">
          <span>Heading</span>
          <strong>
            {snap.airborne ? `${snap.heading}° ${compass(snap.heading)}` : '—'}
          </strong>
        </div>
        <div className="telemetry-tile">
          <span>Vertical rate</span>
          <strong className={verticalClass}>
            {snap.airborne ? (
              <>
                {verticalIcon} {formatSigned(vertical)} <em>ft/min</em>
              </>
            ) : (
              '—'
            )}
          </strong>
        </div>
        <div className="telemetry-tile">
          <span>Distance to go</span>
          <strong>
            {formatNumber(snap.remainingKm)} <em>km</em>
          </strong>
        </div>
        <div className="telemetry-tile">
          <span>Time to go</span>
          <strong>{snap.airborne ? formatDuration(snap.remainingMin) : '—'}</strong>
        </div>
      </div>
    </section>
  )
}

export function AircraftCard({ snap }: { snap: FlightSnapshot }) {
  const { flight } = snap
  const airline = AIRLINES[flight.airlineCode]
  const distance = flightDistanceKm(flight)

  return (
    <section className="card side-card">
      <div className="card-head">
        <h2>Aircraft &amp; route</h2>
      </div>
      <dl className="detail-list">
        <div>
          <dt>Airframe</dt>
          <dd>{flight.aircraft}</dd>
        </div>
        <div>
          <dt>Registration</dt>
          <dd className="mono">{flight.registration}</dd>
        </div>
        <div>
          <dt>Operator</dt>
          <dd>{airline.name}</dd>
        </div>
        <div>
          <dt>Callsign</dt>
          <dd className="mono">{airline.callsign} {flight.id.replace(/^[A-Z0-9]{2}/, '')}</dd>
        </div>
        <div>
          <dt>Cruise altitude</dt>
          <dd>{formatNumber(cruiseAltitude(flight))} ft</dd>
        </div>
        <div>
          <dt>Great-circle distance</dt>
          <dd>{formatDistance(distance)}</dd>
        </div>
      </dl>
    </section>
  )
}

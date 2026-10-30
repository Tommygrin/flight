import { getAirport } from '../data/airports'
import type { FlightSnapshot } from '../lib/flight'
import { cruiseAltitude } from '../lib/flight'
import { formatNumber, formatTime, formatZoneOffset } from '../lib/format'

interface TimelineCardProps {
  snap: FlightSnapshot
  now: number
}

interface TimelineEvent {
  key: string
  title: string
  detail: string
  ts: number
  tz: string
  state: 'done' | 'next' | 'upcoming'
}

export default function TimelineCard({ snap, now }: TimelineCardProps) {
  const { flight } = snap
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)

  if (flight.cancelled) {
    return (
      <section className="card timeline-card">
        <div className="card-head">
          <h2>Flight timeline</h2>
          <span className="card-head-note">all times local</span>
        </div>
        <div className="cancel-note">
          <span className="status-pill tone-rose is-sm">
            <span className="status-dot" />
            Cancelled
          </span>
          <h3>This flight has been cancelled</h3>
          <p>
            {flight.id} to {to.city} was cancelled by the airline. Passengers have been rebooked
            onto the next available service. Contact the airline for rebooking or a full refund.
          </p>
          <div className="cancel-times">
            <span>
              Scheduled departure <strong>{formatTime(snap.scheduledDep, from.tz)} {formatZoneOffset(snap.scheduledDep, from.tz)}</strong>
            </span>
            <span>
              Scheduled arrival <strong>{formatTime(snap.scheduledArr, to.tz)} {formatZoneOffset(snap.scheduledArr, to.tz)}</strong>
            </span>
          </div>
        </div>
      </section>
    )
  }

  const timestamps: Omit<TimelineEvent, 'state'>[] = [
    {
      key: 'checkin',
      title: 'Check-in opens',
      detail: `Terminal ${flight.depTerminal} · counters open`,
      ts: snap.estimatedDep - 180 * 60_000,
      tz: from.tz,
    },
    {
      key: 'boarding',
      title: 'Boarding',
      detail: `Gate ${flight.depGate} · Terminal ${flight.depTerminal}`,
      ts: snap.estimatedDep - 45 * 60_000,
      tz: from.tz,
    },
    {
      key: 'departure',
      title: snap.delayMin > 0 ? 'Departed late' : 'Departed',
      detail:
        snap.delayMin > 0
          ? `${snap.delayMin} min behind schedule · Gate ${flight.depGate}`
          : `On schedule · Gate ${flight.depGate}`,
      ts: snap.estimatedDep,
      tz: from.tz,
    },
    {
      key: 'cruise',
      title: 'At cruise altitude',
      detail: `Flight level ${formatNumber(cruiseAltitude(flight) / 100)} · ${flight.registration}`,
      ts: snap.estimatedDep + flight.durationMin * 0.26 * 60_000,
      tz: from.tz,
    },
    {
      key: 'descent',
      title: 'Descent begins',
      detail: `Descending into ${to.city} · ${to.code}`,
      ts: snap.estimatedArr - 40 * 60_000,
      tz: to.tz,
    },
    {
      key: 'arrival',
      title: 'Touchdown',
      detail: `Terminal ${flight.arrTerminal} · Gate ${flight.arrGate} · Belt ${flight.baggage}`,
      ts: snap.estimatedArr,
      tz: to.tz,
    },
  ]

  const firstUpcoming = timestamps.findIndex((event) => event.ts > now)
  const events: TimelineEvent[] = timestamps.map((event, index) => ({
    ...event,
    state: event.ts <= now ? 'done' : index === firstUpcoming ? 'next' : 'upcoming',
  }))

  return (
    <section className="card timeline-card">
      <div className="card-head">
        <h2>Flight timeline</h2>
        <span className="card-head-note">all times local</span>
      </div>

      <ol className="timeline">
        {events.map((event) => (
          <li key={event.key} className={`timeline-item is-${event.state}`}>
            <div className="timeline-time">
              <strong>{formatTime(event.ts, event.tz)}</strong>
              <span>{formatZoneOffset(event.ts, event.tz)}</span>
            </div>
            <div className="timeline-marker" aria-hidden="true">
              <span className="timeline-dot" />
            </div>
            <div className="timeline-body">
              <span className="timeline-title">
                {event.title}
                {event.state === 'next' && <span className="timeline-now">next</span>}
              </span>
              <span className="timeline-detail">{event.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

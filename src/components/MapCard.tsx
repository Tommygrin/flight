import { useState } from 'react'
import { getAirport } from '../data/airports'
import type { FlightSnapshot } from '../lib/flight'
import { formatNumber, formatTime, formatZoneOffset } from '../lib/format'
import WorldMap from './WorldMap'

interface MapCardProps {
  snap: FlightSnapshot
  network: FlightSnapshot[]
  onSelectFlight: (id: string) => void
}

export default function MapCard({ snap, network, onSelectFlight }: MapCardProps) {
  const [showNetwork, setShowNetwork] = useState(true)
  const to = getAirport(snap.flight.to)

  return (
    <section className="card map-card">
      <div className="map-head">
        <div className="map-title">
          <span className="live-dot" />
          <h2>Live position</h2>
          <span className="map-updated">updated just now</span>
        </div>
        <button
          type="button"
          className={`switch ${showNetwork ? 'is-on' : ''}`}
          onClick={() => setShowNetwork((value) => !value)}
          aria-pressed={showNetwork}
        >
          <span className="switch-track" aria-hidden="true">
            <span className="switch-thumb" />
          </span>
          Network
        </button>
      </div>

      <WorldMap
        flight={snap.flight}
        snap={snap}
        network={network}
        showNetwork={showNetwork}
        onSelectFlight={onSelectFlight}
      />

      <div className="map-foot">
        <div className="map-stat">
          <span>Distance flown</span>
          <strong>{formatNumber(snap.flownKm)} km</strong>
        </div>
        <div className="map-stat">
          <span>Remaining</span>
          <strong>{formatNumber(snap.remainingKm)} km</strong>
        </div>
        <div className="map-stat">
          <span>Progress</span>
          <strong>{Math.round(snap.progress * 100)}%</strong>
        </div>
        <div className="map-stat">
          <span>Estimated arrival</span>
          <strong>
            {formatTime(snap.estimatedArr, to.tz)}{' '}
            <em>{formatZoneOffset(snap.estimatedArr, to.tz)}</em>
          </strong>
        </div>
      </div>
    </section>
  )
}

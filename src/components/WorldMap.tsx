import { useMemo, useState } from 'react'
import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule10,
  geoInterpolate,
  type GeoPermissibleObjects,
  type GeoProjection,
} from 'd3-geo'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { getAirport } from '../data/airports'
import type { Flight } from '../data/flights'
import type { FlightSnapshot } from '../lib/flight'
import { positionAt } from '../lib/flight'

const W = 1000
const H = 500

interface WorldMapProps {
  flight: Flight
  snap: FlightSnapshot
  network: FlightSnapshot[]
  showNetwork: boolean
  onSelectFlight: (id: string) => void
}

const PLANE_PATH = 'M14.5 0.6 9.1 7.3 2.4 5.9 0.1 8.3l6.4 1.5-2.6 3.2-3.4-.4-1 1.2 3.1 1.9 1.7 1.7 1.9-1 .3-3.5 3.1-2.6 1.5 6.4 1.8-1.8-.3-4.8 6.7-5.4z'

/** Great-circle midpoint longitude, so each route is centred on the map. */
function routeRotation(flight: Flight): number {
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const delta = ((to.lon - from.lon + 540) % 360) - 180
  return from.lon + delta / 2
}

function buildRoutePath(
  projection: GeoProjection,
  from: [number, number],
  to: [number, number],
  t0: number,
  t1: number,
): string {
  const interpolate = geoInterpolate(from, to)
  const steps = 180
  let d = ''
  let previous: [number, number] | null = null
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps
    const point = projection(interpolate(t))
    if (!point) continue
    const [x, y] = point
    // Start a new subpath if the projection wraps around the antimeridian.
    if (!previous || Math.abs(x - previous[0]) > W * 0.55) {
      d += `M${x.toFixed(2)},${y.toFixed(2)}`
    } else {
      d += `L${x.toFixed(2)},${y.toFixed(2)}`
    }
    previous = point
  }
  return d
}

function bearingLabel(heading: number): string {
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return points[Math.round(heading / 45) % 8]
}

export default function WorldMap({
  flight,
  snap,
  network,
  showNetwork,
  onSelectFlight,
}: WorldMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<[number, number]>([0, 0])
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const rotation = useMemo(() => routeRotation(flight), [flight])

  const { landPaths, globePath, graticulePath, projection } = useMemo(() => {
    const projection = geoNaturalEarth1()
      .rotate([-rotation, 0])
      .fitExtent(
        [
          [8, 16],
          [W - 8, H - 16],
        ],
        { type: 'Sphere' } as GeoPermissibleObjects,
      )
    const path = geoPath(projection)
    const countries = feature(
      worldData as never,
      (worldData as unknown as { objects: { countries: never } }).objects.countries,
    ) as unknown as GeoPermissibleObjects
    return {
      projection,
      landPaths: path(countries) ?? '',
      globePath: path({ type: 'Sphere' } as GeoPermissibleObjects) ?? '',
      graticulePath: path(geoGraticule10()) ?? '',
    }
  }, [rotation])

  const geometry = useMemo(() => {
    const fromPt: [number, number] = [from.lon, from.lat]
    const toPt: [number, number] = [to.lon, to.lat]
    const p = snap.progress
    return {
      flown: p > 0 ? buildRoutePath(projection, fromPt, toPt, 0, p) : '',
      remaining: p < 1 ? buildRoutePath(projection, fromPt, toPt, p, 1) : '',
      full: buildRoutePath(projection, fromPt, toPt, 0, 1),
    }
  }, [projection, from.lon, from.lat, to.lon, to.lat, snap.progress])

  const fromXY = projection([from.lon, from.lat]) ?? [0, 0]
  const toXY = projection([to.lon, to.lat]) ?? [0, 0]
  const planeXY = projection(snap.position) ?? [0, 0]

  const planeAngle = useMemo(() => {
    const ahead = projection(positionAt(flight, Math.min(1, snap.progress + 0.002))) ?? planeXY
    const behind = projection(positionAt(flight, Math.max(0, snap.progress - 0.002))) ?? planeXY
    const dx = ahead[0] - behind[0]
    const dy = ahead[1] - behind[1]
    if (Math.hypot(dx, dy) < 0.01 || Math.hypot(dx, dy) > 260) return 0
    return (Math.atan2(dy, dx) * 180) / Math.PI
  }, [projection, flight, snap.progress, planeXY])

  const fromAnchorEnd = fromXY[0] > W * 0.72
  const toAnchorEnd = toXY[0] > W * 0.72
  const tagX = Math.min(W - 88, Math.max(8, planeXY[0] + 15))
  const tagY = Math.min(H - 28, Math.max(6, planeXY[1] - 33))

  const networkPoints = network
    .filter((s) => s.airborne && s.flight.id !== flight.id)
    .map((s) => ({ s, xy: projection(s.position) }))
    .filter((p): p is { s: FlightSnapshot; xy: [number, number] } => Boolean(p.xy))

  const hudLeft = flight.cancelled
    ? 'CANCELLED · NOT OPERATING'
    : snap.airborne
      ? `${snap.altitudeFt.toLocaleString('en-US')} FT · ${snap.speedKts} KTS · ${bearingLabel(snap.heading)}`
      : snap.progress >= 1
        ? 'ON GROUND · ARRIVED'
        : 'ON GROUND · SCHEDULED'
  const viewWidth = W / zoom
  const viewHeight = H / zoom
  const viewX = (W - viewWidth) / 2 + pan[0]
  const viewY = (H - viewHeight) / 2 + pan[1]
  const panMap = (x: number, y: number) => setPan(([currentX, currentY]) => [currentX + x / zoom, currentY + y / zoom])

  return (
    <div className="map-wrap">
      <svg
        className="world-map"
        viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Simulated flight map of ${flight.id} from ${from.city} to ${to.city}`}
      >
        <defs>
          <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1726" />
            <stop offset="55%" stopColor="#08121e" />
            <stop offset="100%" stopColor="#060d17" />
          </linearGradient>
          <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="routeFlown" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f8fd0" />
            <stop offset="60%" stopColor="#4cc2ff" />
            <stop offset="100%" stopColor="#8ef2d2" />
          </linearGradient>
          <filter id="routeGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
          <filter id="planeGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="#070e18" />
        <path d={globePath} fill="url(#ocean)" />
        <path d={graticulePath} fill="none" stroke="#16283a" strokeWidth={0.55} opacity={0.9} />
        <path d={landPaths} fill="#14212f" stroke="#22364a" strokeWidth={0.6} strokeLinejoin="round" />
        <path d={globePath} fill="none" stroke="#24384d" strokeWidth={0.8} />
        <rect width={W} height={H} fill="url(#vignette)" pointerEvents="none" />

        {/* faint outline of the whole route */}
        <path d={geometry.full} fill="none" stroke="#2a425a" strokeWidth={1.4} opacity={0.55} />

        {flight.cancelled ? (
          <path
            d={geometry.full}
            fill="none"
            stroke="#7d4050"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="2 7"
            opacity={0.9}
          />
        ) : (
          <>
            {/* remaining leg */}
            <path
              className="route-remaining"
              d={geometry.remaining}
              fill="none"
              stroke="#5f8fae"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="1 7"
              opacity={0.85}
            />

            {/* flown leg with glow */}
            <g>
              <path
                d={geometry.flown}
                fill="none"
                stroke="#4cc2ff"
                strokeWidth={4.5}
                strokeLinecap="round"
                opacity={0.5}
                filter="url(#routeGlow)"
              />
              <path
                d={geometry.flown}
                fill="none"
                stroke="url(#routeFlown)"
                strokeWidth={2.6}
                strokeLinecap="round"
              />
            </g>
          </>
        )}

        {/* network traffic */}
        {showNetwork &&
          networkPoints.map(({ s, xy }) => (
            <g
              key={s.flight.id}
              className="network-dot"
              onClick={() => onSelectFlight(s.flight.id)}
              role="button"
              tabIndex={0}
              aria-label={`Track ${s.flight.id}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectFlight(s.flight.id)
              }}
            >
              <circle cx={xy[0]} cy={xy[1]} r={9} fill="transparent" />
              <circle cx={xy[0]} cy={xy[1]} r={2.6} fill="#59c9f5" opacity={0.62} />
              <circle cx={xy[0]} cy={xy[1]} r={6} fill="none" stroke="#4cc2ff" strokeWidth={0.8} opacity={0.22} />
              <title>{`${s.flight.id} · ${getAirport(s.flight.from).city} → ${getAirport(s.flight.to).city}`}</title>
            </g>
          ))}

        {/* destination marker */}
        <g>
          <circle cx={toXY[0]} cy={toXY[1]} r={14} fill="none" stroke="#8ef2d2" strokeWidth={1} opacity={0.35} className="dest-ring" />
          <circle cx={toXY[0]} cy={toXY[1]} r={5.5} fill="none" stroke="#8ef2d2" strokeWidth={1.8} />
          <circle cx={toXY[0]} cy={toXY[1]} r={1.6} fill="#8ef2d2" />
          <text
            x={toXY[0] + (toAnchorEnd ? -12 : 12)}
            y={toXY[1] + 4}
            textAnchor={toAnchorEnd ? 'end' : 'start'}
            className="map-code"
          >
            {to.code}
          </text>
          <text
            x={toXY[0] + (toAnchorEnd ? -12 : 12)}
            y={toXY[1] + 17}
            textAnchor={toAnchorEnd ? 'end' : 'start'}
            className="map-city"
          >
            {to.city}
          </text>
        </g>

        {/* origin marker */}
        <g>
          <circle cx={fromXY[0]} cy={fromXY[1]} r={5.5} fill="none" stroke="#4cc2ff" strokeWidth={1.8} />
          <circle cx={fromXY[0]} cy={fromXY[1]} r={1.6} fill="#4cc2ff" />
          <text
            x={fromXY[0] + (fromAnchorEnd ? -12 : 12)}
            y={fromXY[1] + 4}
            textAnchor={fromAnchorEnd ? 'end' : 'start'}
            className="map-code"
          >
            {from.code}
          </text>
          <text
            x={fromXY[0] + (fromAnchorEnd ? -12 : 12)}
            y={fromXY[1] + 17}
            textAnchor={fromAnchorEnd ? 'end' : 'start'}
            className="map-city"
          >
            {from.city}
          </text>
        </g>

        {/* live aircraft */}
        {snap.airborne && (
          <>
            <g className="plane-tag" transform={`translate(${tagX} ${tagY})`}>
              <rect width={76} height={19} rx={5} fill="#07131f" stroke="#2b4a63" strokeWidth={0.8} opacity={0.92} />
              <text x={7} y={12.5} className="plane-tag-text">
                {flight.id}
              </text>
            </g>
            <g transform={`translate(${planeXY[0]} ${planeXY[1]})`} className="plane-marker">
              <circle r={20} fill="#4cc2ff" opacity={0.13} filter="url(#planeGlow)" />
              <circle r={11} fill="none" stroke="#4cc2ff" strokeWidth={1} opacity={0.3} className="plane-pulse" />
              <g transform={`rotate(${planeAngle})`}>
                <path d={PLANE_PATH} fill="#f2f8ff" transform="translate(-7.5 -9) scale(1.5)" />
              </g>
            </g>
          </>
        )}

        {/* corner HUD */}
        <g className="map-hud">
          <circle cx={18} cy={22} r={3} className="demo-dot" />
          <text x={28} y={26} className="hud-label">
            {flight.cancelled ? 'NO ACTIVE TRACKING' : 'DEMO TRAFFIC'}
          </text>
          <text x={16} y={H - 16} className="hud-label">
            {hudLeft}
          </text>
          <text x={W - 16} y={H - 16} textAnchor="end" className="hud-label">
            {Math.round(snap.progress * 100)}% OF ROUTE
          </text>
        </g>
      </svg>
      <div className="map-controls" role="group" aria-label="Map controls">
        <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(2.4, Number((value + 0.25).toFixed(2))))}>+</button>
        <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(1, Number((value - 0.25).toFixed(2))))}>−</button>
        <span className="map-control-divider" aria-hidden="true" />
        <button type="button" aria-label="Pan map left" onClick={() => panMap(-70, 0)}>←</button>
        <button type="button" aria-label="Pan map right" onClick={() => panMap(70, 0)}>→</button>
        <button type="button" aria-label="Pan map up" onClick={() => panMap(0, -55)}>↑</button>
        <button type="button" aria-label="Pan map down" onClick={() => panMap(0, 55)}>↓</button>
        <button type="button" className="map-reset" onClick={() => { setZoom(1); setPan([0, 0]) }}>Reset</button>
      </div>
    </div>
  )
}

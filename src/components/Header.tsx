import Search from './Search'
import type { Flight } from '../domain/models'

export type View = 'track' | 'board' | 'watchlist'

interface HeaderProps {
  now: number
  view: View
  watchlistCount: number
  onNavigate: (view: View) => void
  onSelectFlight: (id: string) => void
  onSelectAirport: (code: string) => void
  flights: Flight[]
}

const NAV: { key: View; label: string }[] = [
  { key: 'track', label: 'Track' },
  { key: 'board', label: 'Flight board' },
  { key: 'watchlist', label: 'Watchlist' },
]

function localClock(ts: number): { time: string; zone: string } {
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(ts)
  const zone =
    new Intl.DateTimeFormat('en-GB', { timeZoneName: 'shortOffset' })
      .formatToParts(ts)
      .find((part) => part.type === 'timeZoneName')?.value ?? ''
  return { time, zone }
}

export default function Header({
  now,
  view,
  watchlistCount,
  onNavigate,
  onSelectFlight,
  onSelectAirport,
  flights,
}: HeaderProps) {
  const clock = localClock(now)

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button type="button" className="brand" onClick={() => onNavigate('track')} aria-label="SkyTrace home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <defs>
                <linearGradient id="markGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5ad2ff" />
                  <stop offset="100%" stopColor="#8ef2d2" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="9" fill="#0e1b2b" />
              <path d="M6.4 18.7 25.8 9.2l-6.6 15.1-2.7-6.3-6.9-1.9Z" fill="url(#markGrad)" />
              <path d="M6.4 18.7 25.8 9.2 16.5 17.9l-2.7-6.3" fill="#0e1b2b" opacity=".35" />
            </svg>
          </span>
          <span className="brand-text">
            SkyTrace
            <span className="brand-live">DEMO</span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${view === item.key ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.key)}
              aria-current={view === item.key ? 'page' : undefined}
            >
              {item.label}
              {item.key === 'watchlist' && watchlistCount > 0 && (
                <span className="nav-count">{watchlistCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <Search now={now} flights={flights} onSelectFlight={onSelectFlight} onSelectAirport={onSelectAirport} />
          <div className="clock" title="Your local time">
            <span className="clock-indicator" aria-hidden="true" />
            <span className="clock-time">{clock.time}</span>
            <span className="clock-zone">{clock.zone}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

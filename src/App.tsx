import { useEffect, useMemo, useState } from 'react'
import Board, { type Tab } from './components/Board'
import FlightHero from './components/FlightHero'
import Header, { type View } from './components/Header'
import MapCard from './components/MapCard'
import { AircraftCard, GatesCard, TelemetryCard } from './components/SideCards'
import TimelineCard from './components/TimelineCard'
import Watchlist from './components/Watchlist'
import { getAirport } from './data/airports'
import { FLIGHTS, getFlight } from './data/flights'
import { snapshot } from './lib/flight'

const WATCHLIST_KEY = 'skytrace.watchlist.v1'
const DEFAULT_WATCHLIST = ['EK202', 'QF12']

function readWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY)
    if (!raw) return DEFAULT_WATCHLIST
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === 'string' && FLIGHTS.some((f) => f.id === id))
    }
  } catch {
    /* ignore corrupt storage */
  }
  return DEFAULT_WATCHLIST
}

export default function App() {
  const [now, setNow] = useState(() => Date.now())
  const [view, setView] = useState<View>('track')
  const [selectedId, setSelectedId] = useState('BA74')
  const [boardAirport, setBoardAirport] = useState('LOS')
  const [boardTab, setBoardTab] = useState<Tab>('departures')
  const [watchlist, setWatchlist] = useState<string[]>(readWatchlist)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    } catch {
      /* storage may be unavailable */
    }
  }, [watchlist])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const flight = getFlight(selectedId)
    const from = getAirport(flight.from)
    const to = getAirport(flight.to)
    document.title = `${flight.id} ${from.code} → ${to.code} · SkyTrace`
  }, [selectedId])

  const allSnapshots = useMemo(
    () => FLIGHTS.map((flight) => snapshot(flight, now)),
    [now],
  )

  const selectedSnap = useMemo(
    () => allSnapshots.find((snap) => snap.flight.id === selectedId) ?? snapshot(getFlight(selectedId), now),
    [allSnapshots, selectedId, now],
  )

  function selectFlight(id: string) {
    setSelectedId(id)
    setView('track')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectAirport(code: string, tab: Tab = 'departures') {
    setBoardAirport(code)
    setBoardTab(tab)
    setView('board')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigate(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleWatch(id: string) {
    setWatchlist((current) => {
      const exists = current.includes(id)
      setToast(exists ? `${id} removed from watchlist` : `${id} added to watchlist`)
      return exists ? current.filter((item) => item !== id) : [id, ...current]
    })
  }

  const selectedFrom = getAirport(selectedSnap.flight.from)
  const selectedTo = getAirport(selectedSnap.flight.to)

  return (
    <>
      <Header
        now={now}
        view={view}
        watchlistCount={watchlist.length}
        onNavigate={navigate}
        onSelectFlight={selectFlight}
        onSelectAirport={selectAirport}
      />

      <main className="shell">
        {view === 'track' && (
          <div className="view-enter" key={selectedId}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <button type="button" onClick={() => navigate('board')}>
                {selectedFrom.city}
              </button>
              <span aria-hidden="true">/</span>
              <span>Flight {selectedSnap.flight.id}</span>
              <span aria-hidden="true">/</span>
              <span className="breadcrumb-current">Live tracking</span>
            </nav>

            <FlightHero
              snap={selectedSnap}
              watched={watchlist.includes(selectedId)}
              onToggleWatch={() => toggleWatch(selectedId)}
            />

            <div className="dashboard">
              <div className="col-main">
                <MapCard
                  snap={selectedSnap}
                  network={allSnapshots}
                  onSelectFlight={selectFlight}
                />
                <TimelineCard snap={selectedSnap} now={now} />
              </div>
              <aside className="col-side">
                <GatesCard snap={selectedSnap} />
                <TelemetryCard snap={selectedSnap} />
                <AircraftCard snap={selectedSnap} />
                <button
                  type="button"
                  className="route-link"
                  onClick={() => selectAirport(selectedTo.code, 'arrivals')}
                >
                  <span>
                    <span className="route-link-label">All flights to</span>
                    {selectedTo.city} ({selectedTo.code})
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              </aside>
            </div>
          </div>
        )}

        {view === 'board' && (
          <Board
            now={now}
            airportCode={boardAirport}
            tab={boardTab}
            allSnapshots={allSnapshots}
            onSelectAirport={(code) => setBoardAirport(code)}
            onSelectFlight={selectFlight}
            onTabChange={setBoardTab}
          />
        )}

        {view === 'watchlist' && (
          <Watchlist
            now={now}
            watchlist={watchlist}
            onSelectFlight={selectFlight}
            onToggleWatch={toggleWatch}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-mark" aria-hidden="true">✈</span>
            <span>
              <strong>SkyTrace</strong>
              <span>Live flight tracking</span>
            </span>
          </div>
          <p className="footer-note">
            All flight, airport and weather data on this site is simulated for demonstration
            purposes. Not for operational use.
          </p>
          <div className="footer-meta">
            <span>UTC {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(now)}</span>
            <span className="footer-dot" />
            <span>{FLIGHTS.length} flights tracked</span>
          </div>
        </div>
      </footer>

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

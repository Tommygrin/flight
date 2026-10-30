import { useEffect, useMemo, useRef, useState } from 'react'
import { AIRLINES, AIRPORTS, getAirport, type Airport } from '../data/airports'
import { FLIGHTS, type Flight } from '../data/flights'
import { statusFor } from '../lib/flight'

interface SearchProps {
  now: number
  onSelectFlight: (id: string) => void
  onSelectAirport: (code: string) => void
}

type Result =
  | { kind: 'flight'; flight: Flight }
  | { kind: 'airport'; airport: Airport }

const POPULAR = ['BA74', 'EK202', 'QF12', 'SQ317', 'QR1412']

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function scoreFlight(flight: Flight, query: string): number {
  const q = normalise(query)
  if (!q) return -1
  const airline = AIRLINES[flight.airlineCode]
  const from = getAirport(flight.from)
  const to = getAirport(flight.to)
  const id = normalise(flight.id)
  const route = `${normalise(from.code)}${normalise(to.code)}`
  const routeReverse = `${normalise(to.code)}${normalise(from.code)}`
  const text = [
    id,
    normalise(airline.name),
    normalise(from.name),
    normalise(to.name),
    normalise(from.city),
    normalise(to.city),
    normalise(from.code),
    normalise(to.code),
  ].join(' ')

  if (id === q) return 100
  if (id.startsWith(q)) return 90
  if (route === q || routeReverse === q) return 85
  if (normalise(from.city) + normalise(to.city) === q) return 84
  if (route.includes(q) && q.length >= 5) return 70
  if (normalise(from.city).startsWith(q) || normalise(to.city).startsWith(q)) return 60
  if (normalise(airline.name).startsWith(q)) return 50
  if (text.includes(q)) return 30
  return -1
}

export default function Search({ now, onSelectFlight, onSelectAirport }: SearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      const flights = POPULAR.map((id) => FLIGHTS.find((f) => f.id === id)).filter(
        (f): f is Flight => Boolean(f),
      )
      return { flights, airports: [] as Airport[] }
    }

    const flights = FLIGHTS.map((flight) => ({ flight, score: scoreFlight(flight, trimmed) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.flight.id.localeCompare(b.flight.id))
      .slice(0, 5)
      .map((entry) => entry.flight)

    const q = normalise(trimmed)
    const airports = AIRPORTS.filter((airport) => {
      const fields = [airport.code, airport.city, airport.name, airport.country, airport.city + airport.code]
      return fields.some((field) => normalise(field).includes(q))
    }).slice(0, 3)

    return { flights, airports }
  }, [query])

  const items: Result[] = useMemo(
    () => [
      ...results.flights.map((flight) => ({ kind: 'flight' as const, flight })),
      ...results.airports.map((airport) => ({ kind: 'airport' as const, airport })),
    ],
    [results],
  )

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  function choose(item: Result) {
    if (item.kind === 'flight') {
      onSelectFlight(item.flight.id)
      setQuery('')
    } else {
      onSelectAirport(item.airport.code)
      setQuery('')
    }
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(items.length - 1, i + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (event.key === 'Enter') {
      const item = items[active]
      if (item) {
        event.preventDefault()
        choose(item)
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const showPanel = open
  const isEmpty = items.length === 0

  return (
    <div className="search" ref={wrapRef}>
      <div className={`search-field ${open ? 'is-open' : ''}`}>
        <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Flight, route or airport"
          aria-label="Search flights, routes and airports"
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
          >
            ×
          </button>
        ) : (
          <kbd className="search-kbd">/</kbd>
        )}
      </div>

      {showPanel && (
        <div className="search-panel" role="listbox" aria-label="Search results">
          {isEmpty ? (
            <div className="search-empty">
              <strong>No matches for “{query}”</strong>
              <span>Try a flight number like BA74, or a city such as Lagos.</span>
            </div>
          ) : (
            <>
              <p className="search-section">{query.trim() ? 'Flights' : 'Popular right now'}</p>
              {items.map((item, index) => {
                const selected = index === active
                if (item.kind === 'flight') {
                  const { flight } = item
                  const airline = AIRLINES[flight.airlineCode]
                  const status = statusFor(flight, now)
                  const from = getAirport(flight.from)
                  const to = getAirport(flight.to)
                  return (
                    <button
                      key={flight.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`search-row ${selected ? 'is-active' : ''}`}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => choose(item)}
                    >
                      <span className="airline-chip" style={{ background: `${airline.brand}22`, color: airline.brand }}>
                        {airline.code}
                      </span>
                      <span className="search-row-main">
                        <span className="search-row-title">
                          {flight.id}
                          <span className={`status-dot tone-${status.tone}`} />
                        </span>
                        <span className="search-row-sub">
                          {from.city} → {to.city} ·{' '}
                          {flight.durationMin >= 60
                            ? `${Math.floor(flight.durationMin / 60)}h ${flight.durationMin % 60}m`
                            : `${flight.durationMin}m`}
                        </span>
                      </span>
                      <span className="search-row-side">{status.label}</span>
                    </button>
                  )
                }
                const { airport } = item
                return (
                  <button
                    key={airport.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`search-row ${selected ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(item)}
                  >
                    <span className="airport-chip">{airport.code}</span>
                    <span className="search-row-main">
                      <span className="search-row-title">{airport.city}</span>
                      <span className="search-row-sub">{airport.name} · {airport.country}</span>
                    </span>
                    <span className="search-row-side">Board →</span>
                  </button>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}

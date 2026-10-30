import type { FlightStatus } from '../lib/flight'

export function StatusPill({ status, size = 'md' }: { status: FlightStatus; size?: 'sm' | 'md' }) {
  return (
    <span className={`status-pill tone-${status.tone} ${size === 'sm' ? 'is-sm' : ''}`}>
      <span className="status-dot" />
      {status.label}
    </span>
  )
}

export function StarButton({
  active,
  onClick,
  label = 'Watchlist',
}: {
  active: boolean
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      className={`star-btn ${active ? 'is-on' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove from ${label}` : `Add to ${label}`}
      title={active ? `Remove from ${label}` : `Add to ${label}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3.4l2.6 5.4 5.9.83-4.3 4.14 1.04 5.86L12 16.87l-5.24 2.76L7.8 13.77 3.5 9.63l5.9-.83L12 3.4z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.6 3.4c-.9-.9-2.7-.5-4 .8l-2.7 2.7-8.1-2.4-1.6 1.6 6.5 3.9-2.7 2.7-2.9-.4-1.2 1.2 2.6 1.6.5.5 1.6 2.6 1.2-1.2-.4-2.9 2.7-2.7 3.9 6.5 1.6-1.6-2.4-8.1 2.7-2.7c1.3-1.3 1.7-3.1.7-4.1z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SunCloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="3.4" fill="currentColor" opacity=".9" />
      <path d="M8.5 1.6v1.6M1.6 8.5h1.6M3.6 3.6l1.1 1.1M13.4 3.6l-1.1 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.9 20.4h9.1a3.5 3.5 0 0 0 .3-7 5.1 5.1 0 0 0-9.6 1.4 3.1 3.1 0 0 0 .2 5.6Z" fill="currentColor" opacity=".55" />
    </svg>
  )
}

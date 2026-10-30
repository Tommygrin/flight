# SkyTrace — flight tracking demo

SkyTrace is a responsive flight-tracking experience built with Vite, React, TypeScript, and a custom D3 world map. Search sample flights and airports, inspect route/status/schedule details, filter airport boards, and save flights to a device-local watchlist.

> **Data notice:** this checkout has no flight-data provider, API credentials, or backend configured. All flights, positions, telemetry, weather, gates, and schedules are sample/simulated data. The app labels the source as **Demo data** throughout. It is not real-time and must not be used for travel decisions or operational use.

## Start locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev      # http://localhost:5173
npm run build    # strict TypeScript check + production build
npm run preview  # serve dist/
```

There is no lint or test script in the current repository. The production build runs the configured TypeScript project checks.

## Data architecture

- `src/domain/models.ts` defines the typed flight, aircraft, route, coordinate, and data-source status models.
- `src/services/flightProvider.ts` defines the provider interface, validates/normalizes unknown flight records, and supplies the local sample provider.
- `src/data/` contains the bundled airport, airline, and simulated schedule fixtures.
- `src/lib/flight.ts` derives sample status, route progress, and estimated telemetry from the schedule clock.
- UI components consume the provider-loaded flight records; the sample provider deliberately reports `mode: demo`, no source update timestamp, and an explanatory message.

A real integration should implement `FlightDataProvider` in a server-side adapter and serve normalized records from a same-origin backend endpoint. Keep provider secrets in server environment variables. **Do not put private API keys in `VITE_*` variables or browser code.** A backend/proxy should handle provider authentication, rate limits, timeouts, caching, malformed upstream payloads, and stale-data reporting. No real provider is selected or contacted by this demo.

`.env.example` documents placeholder server settings for a future proxy; it is not required to run the demo. Copy configuration to a local, ignored environment file only when implementing the server adapter.

## Data and UI behavior

- The amber provenance bar shows that the source is sample data and displays the simulation clock in UTC. A simulation time is not a provider freshness timestamp.
- Search supports flight numbers, airline names, routes, airport codes, and city/airport names; `/` or `Ctrl/⌘K` focuses it, arrow keys navigate results, Enter selects, and Escape closes.
- The airport board offers departures/arrivals with airline and status filters. Board times are shown in the selected airport's time zone.
- The map uses bundled Natural Earth geometry from `world-atlas`, `d3-geo`, and `topojson-client`, so it does not need a paid token or map network service. Pan/zoom controls work locally; route and airport geometry are based on bundled fixtures.
- The watchlist is stored in this browser's `localStorage`; it is not synced to an account. If browser storage is blocked, the page reports that changes may not persist.
- Missing or invalid provider records are rejected during normalization before they reach UI state. A provider load error produces a retryable unavailable state.

## Project map

```text
src/
  App.tsx
  components/       search, flight details, map, airport boards, watchlist
  data/             airports, airlines, sample flights
  domain/models.ts  shared flight/data-source types
  services/         provider interface and sample adapter
  lib/              schedule simulation and time/route formatting
  styles.css        responsive design system
```

See [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) for the baseline inspection and implementation notes.

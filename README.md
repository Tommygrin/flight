# SkyTrace — live flight tracking

A polished, fully client-side flight tracking dashboard. Search any flight, follow it across a
live world map, read off altitude, speed and gate information, and watch an airport departures and
arrivals board update in real time.

> **Demo data:** every flight, airport and weather value in this project is simulated. There are no
> API keys, no backend and no network calls at runtime. Do not use it for operational decisions.

## Highlights

- **Search anything** — flight number (`BA74`), airline, city (`Lagos`), airport code (`LOS`), or a
  route (`LOS LHR`). Full keyboard support with `/` or `⌘K` / `Ctrl K` to focus, arrows to move,
  `Enter` to open, `Esc` to dismiss.
- **Live world map** — Natural Earth country geometry projected with `d3-geo`, great-circle route
  arcs, an animated aircraft marker with heading, pulsing destination marker, and a network layer
  of every other airborne flight. The projection auto-centres on the tracked route, so Pacific
  crossings stay in view instead of wrapping at the antimeridian.
- **Flight dashboard** — status badge, scheduled vs. estimated times in each airport's own time
  zone (including `+1` day markers), progress timeline, gates and terminals, baggage belt, live
  telemetry (altitude, ground speed, heading, vertical rate, distance and time to go), aircraft and
  callsign details.
- **Flight timeline** — check-in, boarding, pushback, cruise, descent and touchdown, with completed,
  current and upcoming states.
- **Airport boards** — departures and arrivals for Lagos, London, New York, Dubai, Doha, Paris,
  Addis Ababa and Nairobi. Board language adapts to the tab ("Departed" on departures, "On time" on
  arrivals) and rows link straight through to tracking.
- **Watchlist** — star flights from any screen; the list is stored in `localStorage` and survives
  reloads. Empty and populated states are both designed.
- **Edge cases** — cancelled flights (no aircraft marker, rose dashed route, rebooking notice) and
  landed flights (full route, "tracking complete") are handled explicitly.
- **Responsive & accessible** — layout adapts down to 360 px, semantic landmarks, `aria` state on
  tabs/toggles/search, visible focus rings, and `prefers-reduced-motion` support.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Project structure

```
src/
  App.tsx                  view routing, live clock, watchlist state
  components/
    Header.tsx             brand, navigation, local clock
    Search.tsx             fuzzy search + keyboard navigation
    FlightHero.tsx         flight summary, route progress
    MapCard.tsx            map chrome, network toggle, map stats
    WorldMap.tsx           d3-geo projection, route arcs, aircraft markers
    SideCards.tsx          gates, telemetry, aircraft details
    TimelineCard.tsx       flight event timeline / cancellation notice
    Board.tsx              airport departures & arrivals board
    Watchlist.tsx          saved flights and suggestions
    ui.tsx                 status pill, star button, icons
  data/
    airports.ts            64 airports with coordinates and IANA time zones
    flights.ts             46 simulated services on a rolling daily schedule
  lib/
    flight.ts              status + telemetry simulation, great-circle maths
    format.ts              time-zone aware formatting helpers
  styles.css               design tokens and all component styles
```

## How the simulation works

Schedules are anchored to a five-minute boundary at page load, with each flight carrying an offset
from that baseline, a block time, and an optional delay. Every second the clock advances and the
derived state is recomputed:

- status thresholds (scheduled → boarding → climbing → in flight → descending → landing → landed)
- great-circle position along the route
- altitude and speed from a climb/cruise/descent profile, with small live jitter
- vertical rate from the altitude curve, heading from the route bearing
- local times and calendar-day shifts per airport time zone

Because everything is derived from the current clock, the dashboard stays coherent however long the
page is left open.

## Credits

Country outlines come from [Natural Earth](https://www.naturalearthdata.com/) via the
[`world-atlas`](https://github.com/topojson/world-atlas) package. Maps are drawn with
[`d3-geo`](https://github.com/d3/d3-geo) and [`topojson-client`](https://github.com/topojson/topojson-client).
Type is Inter and JetBrains Mono, bundled locally through Fontsource.

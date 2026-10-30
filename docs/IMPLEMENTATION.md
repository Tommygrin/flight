# SkyTrace implementation notes

## Existing baseline

The repository already contains a responsive React/TypeScript tracking dashboard, D3-based world map, sample flights and airports, flight detail/timeline cards, search, airport boards, and a `localStorage` watchlist. The working tree was clean on `arena/6f3701bf-flight`. There is no provider integration, API credential, backend, or test framework configured. Existing flight schedules and telemetry are simulated; they must not be described as live data.

## Delivery plan

1. Preserve and validate the current experience and its existing design system.
2. Add a typed flight-data provider contract, normalized domain records, input validation, and an explicit sample provider; keep provider configuration secret-safe and browser-safe.
3. Expose source mode, freshness, storage failures, and a practical status/airline/route filter in the UI without implying sample telemetry is operational.
4. Document the secure server/proxy path for a future real provider and the limits of the demo.
5. Install from the lockfile, run the available type-check/production build, inspect the diff and Git status, and commit/push only to the session branch.

## Provider integration path

A production provider should be called from a server-side adapter or same-origin proxy. Keep private credentials in server environment variables; do not put them in `VITE_*` variables or browser bundles. The client-side provider interface in `src/services` is intentionally replaceable and currently returns clearly labeled demo records. Provider adapters must validate untrusted payloads before the UI consumes them and report source mode, update time, stale state, and errors.

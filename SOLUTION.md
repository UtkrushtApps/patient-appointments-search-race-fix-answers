# Solution Steps

1. Make the appointments search component client-side state authoritative for the current input query and status, while validating the initial status so invalid URL values fall back to `all`.

2. Replace immediate per-keystroke searching with a debounced `useEffect`: whenever patient id, query, or status changes, clear the previous timer and start a new one; only call `searchAppointments` after the settle window expires.

3. Guard against stale async responses by incrementing a request id for each scheduled search and applying results/loading state only when the resolving request id still matches the latest id.

4. Move URL synchronization into its own effect and call `router.replace(...)` with the current query/status query string, omitting empty query and `all` status, so URLs remain shareable without pushing a history entry per keystroke.

5. Stabilize event handlers with `useCallback`, stabilize filtered appointments and per-card `actions` objects with `useMemo`, and wrap `AppointmentCard` and `StatusFilter` in `React.memo` so unrelated input rerenders do not force every card to rerender.

6. Keep the appointment filtering library pure and deterministic; the simulated async search still uses the filtering helper and delayed promise.

7. Extend the RTL tests by mocking `next/navigation` and `searchAppointments`, enabling Jest fake timers, and advancing timers to assert that rapid typing produces no request until the debounce window completes and then exactly one request with the final query.

8. Add a controlled deferred-promise test that starts multiple searches, resolves the newest request first, then resolves an older request later, and verifies the visible appointment list remains the newest result set.

9. Assert URL updates use `router.replace` and never `router.push` during typing.


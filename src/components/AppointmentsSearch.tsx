'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { searchAppointments } from '@/lib/appointments';
import type { Appointment, AppointmentStatus } from '@/types/appointment';
import AppointmentCard from '@/components/AppointmentCard';
import StatusFilter from '@/components/StatusFilter';

export const APPOINTMENTS_SEARCH_DEBOUNCE_MS = 300;

type Props = {
  patientId: string;
  initialQuery: string;
  initialStatus: string;
};

const VALID_STATUSES: ReadonlySet<string> = new Set([
  'all',
  'scheduled',
  'completed',
  'cancelled'
]);

function normalizeStatus(value: string): AppointmentStatus | 'all' {
  return VALID_STATUSES.has(value) ? (value as AppointmentStatus | 'all') : 'all';
}

function buildAppointmentsUrl(
  pathname: string,
  query: string,
  status: AppointmentStatus | 'all'
): string {
  const params = new URLSearchParams();
  const normalizedQuery = query.trim();

  if (normalizedQuery) params.set('q', normalizedQuery);
  if (status !== 'all') params.set('status', status);

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function AppointmentsSearch({ patientId, initialQuery, initialStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<AppointmentStatus | 'all'>(() =>
    normalizeStatus(initialStatus)
  );
  const [results, setResults] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const latestRequestId = useRef(0);

  useEffect(() => {
    router.replace(buildAppointmentsUrl(pathname, query, status));
  }, [pathname, query, router, status]);

  useEffect(() => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      searchAppointments({ patientId, query, status })
        .then((data) => {
          if (latestRequestId.current === requestId) {
            setResults(data);
          }
        })
        .catch(() => {
          if (latestRequestId.current === requestId) {
            setResults([]);
          }
        })
        .finally(() => {
          if (latestRequestId.current === requestId) {
            setLoading(false);
          }
        });
    }, APPOINTMENTS_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [patientId, query, status]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleStatusChange = useCallback((value: AppointmentStatus | 'all') => {
    setStatus(value);
  }, []);

  const visibleAppointments = useMemo(
    () => results.filter((appointment) => appointment.patientId === patientId),
    [patientId, results]
  );

  const appointmentRows = useMemo(
    () =>
      visibleAppointments.map((appointment) => ({
        appointment,
        actions: { canReschedule: appointment.status === 'scheduled' }
      })),
    [visibleAppointments]
  );

  return (
    <section>
      <label htmlFor="appointment-search">Search appointments</label>
      <input
        id="appointment-search"
        type="text"
        value={query}
        placeholder="Search by reason or provider"
        onChange={(event) => handleQueryChange(event.target.value)}
        style={{ display: 'block', width: '100%', padding: 8, margin: '8px 0' }}
      />

      <StatusFilter value={status} onChange={handleStatusChange} />

      {loading ? <p role="status">Searching...</p> : null}

      {!loading && visibleAppointments.length === 0 ? (
        <p data-testid="empty-state">No appointments match this search.</p>
      ) : null}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {appointmentRows.map(({ appointment, actions }) => (
          <AppointmentCard key={appointment.id} appointment={appointment} actions={actions} />
        ))}
      </ul>
    </section>
  );
}

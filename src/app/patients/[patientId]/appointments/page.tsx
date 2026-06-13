import AppointmentsSearch from '@/components/AppointmentsSearch';

export default function AppointmentsPage({
  params,
  searchParams
}: {
  params: { patientId: string };
  searchParams: { q?: string; status?: string };
}) {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Appointments for patient {params.patientId}</h1>
      <AppointmentsSearch
        patientId={params.patientId}
        initialQuery={searchParams.q ?? ''}
        initialStatus={searchParams.status ?? 'all'}
      />
    </main>
  );
}

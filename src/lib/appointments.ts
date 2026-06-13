import type { Appointment, AppointmentStatus } from '@/types/appointment';
import { APPOINTMENTS } from '@/lib/data';

export type SearchParams = {
  patientId: string;
  query: string;
  status: AppointmentStatus | 'all';
};

export function filterAppointments(
  all: Appointment[],
  { patientId, query, status }: SearchParams
): Appointment[] {
  const normalized = query.trim().toLowerCase();
  return all.filter((appointment) => {
    if (appointment.patientId !== patientId) return false;
    if (status !== 'all' && appointment.status !== status) return false;
    if (!normalized) return true;
    return (
      appointment.reason.toLowerCase().includes(normalized) ||
      appointment.provider.toLowerCase().includes(normalized)
    );
  });
}

function randomLatency(): number {
  return 80 + Math.floor(Math.random() * 320);
}

export function searchAppointments(params: SearchParams): Promise<Appointment[]> {
  const data = filterAppointments(APPOINTMENTS, params);
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), randomLatency());
  });
}

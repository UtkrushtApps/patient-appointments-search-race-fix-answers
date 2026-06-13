export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  reason: string;
  provider: string;
  date: string;
  status: AppointmentStatus;
}

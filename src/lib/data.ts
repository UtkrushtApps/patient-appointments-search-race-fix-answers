import type { Appointment } from '@/types/appointment';

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: '42',
    reason: 'Annual physical exam',
    provider: 'Dr. Patel',
    date: '2024-01-12',
    status: 'completed'
  },
  {
    id: 'a2',
    patientId: '42',
    reason: 'Blood pressure follow up',
    provider: 'Dr. Nguyen',
    date: '2024-02-03',
    status: 'scheduled'
  },
  {
    id: 'a3',
    patientId: '42',
    reason: 'Cardiology consultation',
    provider: 'Dr. Okoro',
    date: '2024-02-20',
    status: 'scheduled'
  },
  {
    id: 'a4',
    patientId: '42',
    reason: 'Flu vaccination',
    provider: 'Dr. Patel',
    date: '2023-11-09',
    status: 'completed'
  },
  {
    id: 'a5',
    patientId: '42',
    reason: 'Dermatology screening',
    provider: 'Dr. Klein',
    date: '2024-03-01',
    status: 'cancelled'
  },
  {
    id: 'a6',
    patientId: '42',
    reason: 'Physical therapy session',
    provider: 'Dr. Romero',
    date: '2024-03-14',
    status: 'scheduled'
  },
  {
    id: 'a7',
    patientId: '99',
    reason: 'Pediatric checkup',
    provider: 'Dr. Lewis',
    date: '2024-01-30',
    status: 'completed'
  }
];

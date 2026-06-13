import { filterAppointments } from '@/lib/appointments';
import { APPOINTMENTS } from '@/lib/data';

describe('filterAppointments', () => {
  it('returns only appointments for the given patient', () => {
    const result = filterAppointments(APPOINTMENTS, {
      patientId: '42',
      query: '',
      status: 'all'
    });
    expect(result.every((appointment) => appointment.patientId === '42')).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters by status', () => {
    const result = filterAppointments(APPOINTMENTS, {
      patientId: '42',
      query: '',
      status: 'scheduled'
    });
    expect(result.every((appointment) => appointment.status === 'scheduled')).toBe(true);
  });

  it('matches reason or provider text case-insensitively', () => {
    const result = filterAppointments(APPOINTMENTS, {
      patientId: '42',
      query: 'patel',
      status: 'all'
    });
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((appointment) => appointment.provider.toLowerCase().includes('patel'))
    ).toBe(true);
  });
});

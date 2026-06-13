import { memo } from 'react';
import type { Appointment } from '@/types/appointment';

type Props = {
  appointment: Appointment;
  actions: { canReschedule: boolean };
};

function AppointmentCard({ appointment, actions }: Props) {
  return (
    <li
      data-testid="appointment-card"
      style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 8 }}
    >
      <strong>{appointment.reason}</strong>
      <div>Provider: {appointment.provider}</div>
      <div>Date: {appointment.date}</div>
      <div>Status: {appointment.status}</div>
      {actions.canReschedule ? <button type="button">Reschedule</button> : null}
    </li>
  );
}

export default memo(AppointmentCard);

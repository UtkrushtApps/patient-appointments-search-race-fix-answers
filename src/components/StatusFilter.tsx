import { memo } from 'react';
import type { AppointmentStatus } from '@/types/appointment';

type Props = {
  value: AppointmentStatus | 'all';
  onChange: (value: AppointmentStatus | 'all') => void;
};

const OPTIONS: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

function StatusFilter({ value, onChange }: Props) {
  return (
    <div style={{ margin: '8px 0' }}>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as AppointmentStatus | 'all')}
        style={{ display: 'block', padding: 8, marginTop: 4 }}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default memo(StatusFilter);

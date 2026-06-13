import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppointmentsSearch, {
  APPOINTMENTS_SEARCH_DEBOUNCE_MS
} from '@/components/AppointmentsSearch';
import { APPOINTMENTS } from '@/lib/data';
import { searchAppointments } from '@/lib/appointments';
import type { Appointment } from '@/types/appointment';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => '/patients/42/appointments'
}));

jest.mock('@/lib/appointments', () => {
  const actual = jest.requireActual('@/lib/appointments') as typeof import('@/lib/appointments');
  return {
    ...actual,
    searchAppointments: jest.fn()
  };
});

const mockSearchAppointments = jest.mocked(searchAppointments);

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

async function advanceTimersBy(ms: number): Promise<void> {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

describe('AppointmentsSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockSearchAppointments.mockReset();
    mockSearchAppointments.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the search input and status filter', async () => {
    render(<AppointmentsSearch patientId="42" initialQuery="" initialStatus="all" />);

    expect(await screen.findByLabelText('Search appointments')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('debounces typing into a single search request and updates the URL with replace', async () => {
    render(<AppointmentsSearch patientId="42" initialQuery="" initialStatus="all" />);

    await advanceTimersBy(APPOINTMENTS_SEARCH_DEBOUNCE_MS);
    await waitFor(() => expect(mockSearchAppointments).toHaveBeenCalledTimes(1));

    mockSearchAppointments.mockClear();
    mockPush.mockClear();
    mockReplace.mockClear();

    const input = screen.getByLabelText('Search appointments');

    fireEvent.change(input, { target: { value: 'p' } });
    fireEvent.change(input, { target: { value: 'pa' } });
    fireEvent.change(input, { target: { value: 'pat' } });
    fireEvent.change(input, { target: { value: 'pate' } });
    fireEvent.change(input, { target: { value: 'patel' } });

    expect(mockSearchAppointments).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenLastCalledWith('/patients/42/appointments?q=patel');

    await advanceTimersBy(APPOINTMENTS_SEARCH_DEBOUNCE_MS - 1);
    expect(mockSearchAppointments).not.toHaveBeenCalled();

    await advanceTimersBy(1);

    expect(mockSearchAppointments).toHaveBeenCalledTimes(1);
    expect(mockSearchAppointments).toHaveBeenLastCalledWith({
      patientId: '42',
      query: 'patel',
      status: 'all'
    });
  });

  it('keeps only the newest search response when requests resolve out of order', async () => {
    const deferredSearches: Array<Deferred<Appointment[]>> = [];
    mockSearchAppointments.mockImplementation(() => {
      const deferred = createDeferred<Appointment[]>();
      deferredSearches.push(deferred);
      return deferred.promise;
    });

    render(<AppointmentsSearch patientId="42" initialQuery="" initialStatus="all" />);

    await advanceTimersBy(APPOINTMENTS_SEARCH_DEBOUNCE_MS);
    expect(mockSearchAppointments).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferredSearches[0].resolve([]);
    });

    const input = screen.getByLabelText('Search appointments');

    fireEvent.change(input, { target: { value: 'blood' } });
    await advanceTimersBy(APPOINTMENTS_SEARCH_DEBOUNCE_MS);
    expect(mockSearchAppointments).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'cardiology' } });
    await advanceTimersBy(APPOINTMENTS_SEARCH_DEBOUNCE_MS);
    expect(mockSearchAppointments).toHaveBeenCalledTimes(3);

    const bloodResults = APPOINTMENTS.filter((appointment) => appointment.id === 'a2');
    const cardiologyResults = APPOINTMENTS.filter((appointment) => appointment.id === 'a3');

    await act(async () => {
      deferredSearches[2].resolve(cardiologyResults);
    });

    expect(await screen.findByText('Cardiology consultation')).toBeInTheDocument();
    expect(screen.queryByText('Blood pressure follow up')).not.toBeInTheDocument();

    await act(async () => {
      deferredSearches[1].resolve(bloodResults);
    });

    expect(screen.getByText('Cardiology consultation')).toBeInTheDocument();
    expect(screen.queryByText('Blood pressure follow up')).not.toBeInTheDocument();
  });
});

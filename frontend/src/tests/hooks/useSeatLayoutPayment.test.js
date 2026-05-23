import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { mockToggleSeat, mockSelectMultipleSeats } = vi.hoisted(() => ({
  mockToggleSeat: vi.fn(),
  mockSelectMultipleSeats: vi.fn(),
}));

const { mockToastError, mockToastSuccess } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
  mockToastSuccess: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: mockToastError, success: mockToastSuccess },
}));

vi.mock('../../services/authClient', () => ({
  default: vi.fn(),
  request: vi.fn(),
  authRequest: vi.fn(),
}));

vi.mock('../../../services/api', () => ({
  createPaymentOrder: vi.fn(),
  verifyPayment: vi.fn(),
}));

import useSeatLayoutPayment from '../../Components/SeatLayout/hooks/useSeatLayoutPayment';

const baseProps = {
  selectedSeats: ['A1', 'A2'],
  selectedShow: { _id: 'show1', showPrice: 180 },
  movie: { title: 'Test Movie' },
  subtotal: 360,
  toggleSeat: mockToggleSeat,
  selectMultipleSeats: mockSelectMultipleSeats,
  isSignedIn: true,
  getToken: vi.fn(() => Promise.resolve('mock-token')),
};

describe('useSeatLayoutPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computes total amount with fee and tax', () => {
    const { result } = renderHook(() => useSeatLayoutPayment(baseProps), { wrapper: MemoryRouter });
    const expectedTotal = 360 + 2.99 + (360 * 0.08);
    expect(result.current.totalAmount).toBeCloseTo(expectedTotal, 1);
  });

  it('shows confirmation modal on confirm click with seats', () => {
    const { result } = renderHook(() => useSeatLayoutPayment(baseProps), { wrapper: MemoryRouter });
    act(() => { result.current.handleConfirmClick(); });
    expect(result.current.showConfirmationModal).toBe(true);
  });

  it('shows error on confirm click with no seats', () => {
    const { result } = renderHook(() => useSeatLayoutPayment({ ...baseProps, selectedSeats: [] }), { wrapper: MemoryRouter });
    act(() => { result.current.handleConfirmClick(); });
    expect(result.current.showConfirmationModal).toBe(false);
    expect(mockToastError).toHaveBeenCalledWith('Please select at least one seat to continue.');
  });

  it('handles seat toggle with toast on limit', () => {
    mockToggleSeat.mockReturnValueOnce({ ok: false, reason: 'limit', message: 'Maximum 8 seats allowed' });
    const { result } = renderHook(() => useSeatLayoutPayment(baseProps), { wrapper: MemoryRouter });
    act(() => { result.current.handleToggleSeat('A3'); });
    expect(mockToastError).toHaveBeenCalledWith('You can select up to 8 seats.');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readBookings, writeBookings } from '../../Components/SeatLayout/hooks/seatLayoutStorage';

describe('seatLayoutStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no stored bookings', () => {
    expect(readBookings()).toEqual([]);
  });

  it('writes and reads bookings', () => {
    const bookings = [{ id: '1', seats: ['A1', 'A2'] }];
    writeBookings(bookings);
    expect(readBookings()).toEqual(bookings);
  });

  it('dispatches bookings:changed event on write', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    writeBookings([{ id: '1' }]);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('bookings:changed');
    dispatchSpy.mockRestore();
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('showmovie:bookings', 'invalid json');
    expect(readBookings()).toEqual([]);
  });

  it('handles non-array stored data gracefully', () => {
    localStorage.setItem('showmovie:bookings', JSON.stringify({ not: 'array' }));
    expect(readBookings()).toEqual([]);
  });
});

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useOccupiedSeats } from '../../Components/SeatLayout/hooks/useOccupiedSeats';

describe('useOccupiedSeats', () => {
  const rows = ['A', 'B'];
  const seatsPerRow = 3;

  it('returns occupied seats from selected show', () => {
    const selectedShow = {
      occupiedSeats: { A1: 'user1', A2: 'user2' },
    };
    const { result } = renderHook(() => useOccupiedSeats({ selectedShow, rows, seatsPerRow }));
    expect(result.current).toBeInstanceOf(Set);
    expect(result.current.has('A1')).toBe(true);
    expect(result.current.has('A2')).toBe(true);
    expect(result.current.has('B1')).toBe(false);
  });

  it('returns empty set when selectedShow has no occupiedSeats', () => {
    const selectedShow = { showDateTime: '2026-05-23T10:30:00Z' };
    const { result } = renderHook(() => useOccupiedSeats({ selectedShow, rows, seatsPerRow }));
    expect(result.current).toBeInstanceOf(Set);
    expect(result.current.size).toBe(0);
  });

  it('returns empty set when selectedShow is null', () => {
    const { result } = renderHook(() => useOccupiedSeats({ selectedShow: null, rows, seatsPerRow }));
    expect(result.current).toBeInstanceOf(Set);
    expect(result.current.size).toBe(0);
  });
});

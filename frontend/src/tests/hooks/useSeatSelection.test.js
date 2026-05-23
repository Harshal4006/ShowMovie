import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSeatSelection } from '../../Components/SeatLayout/hooks/useSeatSelection';

const getCount = (result) => result.current.selectedSeats.length;

describe('useSeatSelection', () => {
  const occupiedSeats = new Set(['A1', 'A2', 'B5']);

  it('starts with no selected seats', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    expect(result.current.selectedSeats).toEqual([]);
    expect(result.current.selectedSeatsSet).toEqual(new Set());
    expect(getCount(result)).toBe(0);
  });

  it('toggles a seat into selection', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    act(() => { result.current.toggleSeat('A3'); });
    expect(result.current.selectedSeats).toContain('A3');
    expect(getCount(result)).toBe(1);
  });

  it('toggles a seat out of selection', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    act(() => { result.current.toggleSeat('A3'); });
    expect(getCount(result)).toBe(1);
    act(() => { result.current.toggleSeat('A3'); });
    expect(result.current.selectedSeats).not.toContain('A3');
    expect(getCount(result)).toBe(0);
  });

  it('rejects selection of occupied seats', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats, maxSeats: 8 }));
    act(() => {
      const res = result.current.toggleSeat('A1');
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('occupied');
    });
    expect(result.current.selectedSeats).not.toContain('A1');
  });

  it('rejects invalid seat IDs', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    act(() => {
      const res = result.current.toggleSeat(null);
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('invalid');
    });
    act(() => {
      const res = result.current.toggleSeat('');
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('invalid');
    });
    act(() => {
      const res = result.current.toggleSeat(undefined);
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('invalid');
    });
  });

  it('rejects seat when already at max limit', () => {
    const { result } = renderHook(() =>
      useSeatSelection({ occupiedSeats: new Set(), maxSeats: 2 })
    );
    act(() => {
      result.current.toggleSeat('A3');
    });
    act(() => {
      result.current.toggleSeat('A4');
    });
    expect(getCount(result)).toBe(2);
    act(() => {
      result.current.toggleSeat('A5');
    });
    expect(getCount(result)).toBe(2);
  });

  it('clears all selected seats', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    act(() => { result.current.toggleSeat('A3'); });
    act(() => { result.current.toggleSeat('A4'); });
    expect(getCount(result)).toBe(2);
    act(() => { result.current.clearSelection(); });
    expect(result.current.selectedSeats).toEqual([]);
    expect(getCount(result)).toBe(0);
  });

  it('selects multiple seats at once', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats, maxSeats: 8 }));
    act(() => {
      const res = result.current.selectMultipleSeats(['C1', 'C2', 'C3']);
      expect(res.ok).toBe(true);
    });
    expect(result.current.selectedSeats).toContain('C1');
    expect(result.current.selectedSeats).toContain('C2');
    expect(result.current.selectedSeats).toContain('C3');
    expect(getCount(result)).toBe(3);
  });

  it('skips occupied seats in multi-select', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats, maxSeats: 8 }));
    act(() => {
      const res = result.current.selectMultipleSeats(['A1', 'C1', 'A2', 'C2']);
      expect(res.ok).toBe(true);
    });
    expect(result.current.selectedSeats).not.toContain('A1');
    expect(result.current.selectedSeats).not.toContain('A2');
    expect(result.current.selectedSeats).toContain('C1');
    expect(result.current.selectedSeats).toContain('C2');
    expect(getCount(result)).toBe(2);
  });

  it('rejects invalid array for multi-select', () => {
    const { result } = renderHook(() => useSeatSelection({ occupiedSeats: new Set(), maxSeats: 8 }));
    act(() => {
      const res = result.current.selectMultipleSeats(null);
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('invalid');
    });
  });
});

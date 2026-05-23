import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useSeatLayoutModel } from '../../Components/SeatLayout/hooks/useSeatLayoutModel';

vi.mock('../../services/api', () => ({
  getMovieById: vi.fn(() => new Promise(() => {})),
  getShowsByMovie: vi.fn(() => new Promise(() => {})),
}));

describe('useSeatLayoutModel', () => {
  it('returns loading status initially', () => {
    const { result } = renderHook(() => useSeatLayoutModel({ id: 'movie1', date: '2026-05-23', time: '10:30 AM' }), {
      wrapper: MemoryRouter,
    });
    expect(result.current.status).toBe('loading');
    expect(result.current.movie).toBeNull();
    expect(result.current.selectedSeats).toEqual([]);
  });

  it('returns default rows and seatsPerRow', () => {
    const { result } = renderHook(() => useSeatLayoutModel({ id: 'movie1', date: '2026-05-23', time: '10:30 AM' }), {
      wrapper: MemoryRouter,
    });
    expect(result.current.rows).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    expect(result.current.seatsPerRow).toBe(10);
  });

  it('computes subtotal based on selected seats', () => {
    const { result } = renderHook(() => useSeatLayoutModel({ id: 'movie1', date: '2026-05-23', time: '10:30 AM' }), {
      wrapper: MemoryRouter,
    });
    expect(result.current.subtotal).toBe(0);
  });
});

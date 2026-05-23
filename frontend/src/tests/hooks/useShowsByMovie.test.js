import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const { mockGetShowsByMovie } = vi.hoisted(() => ({
  mockGetShowsByMovie: vi.fn(),
}));

vi.mock('../../services/authClient', () => ({
  default: vi.fn(),
  request: vi.fn(),
  authRequest: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  getShowsByMovie: mockGetShowsByMovie,
}));

import { useShowsByMovie } from '../../Components/SeatLayout/hooks/useShowsByMovie';

describe('useShowsByMovie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockGetShowsByMovie.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useShowsByMovie('movie1'));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns shows on success', async () => {
    const shows = [{ _id: 'show1', showPrice: 180 }];
    mockGetShowsByMovie.mockResolvedValue(shows);
    const { result } = renderHook(() => useShowsByMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.shows).toEqual(shows);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles non-array response', async () => {
    mockGetShowsByMovie.mockResolvedValue({ not: 'array' });
    const { result } = renderHook(() => useShowsByMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.shows).toEqual([]);
  });

  it('handles null movieId', () => {
    const { result } = renderHook(() => useShowsByMovie(null));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.shows).toEqual([]);
  });

  it('sets error on failure', async () => {
    mockGetShowsByMovie.mockRejectedValue(new Error('Failed to load'));
    const { result } = renderHook(() => useShowsByMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.error).toBe('Failed to load');
    expect(result.current.shows).toEqual([]);
  });

  it('ignores AbortError', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mockGetShowsByMovie.mockRejectedValue(abortError);
    const { result } = renderHook(() => useShowsByMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.error).toBeNull();
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetMovieById } = vi.hoisted(() => ({
  mockGetMovieById: vi.fn(),
}));

vi.mock('../../services/authClient', () => ({
  default: vi.fn(),
  request: vi.fn(),
  authRequest: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  getMovieById: mockGetMovieById,
}));

import { useSeatLayoutMovie } from '../../Components/SeatLayout/hooks/useSeatLayoutMovie';

describe('useSeatLayoutMovie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    mockGetMovieById.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSeatLayoutMovie('movie1'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.movie).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns movie data on success', async () => {
    const movie = { _id: 'movie1', title: 'Test Movie' };
    mockGetMovieById.mockResolvedValue(movie);
    const { result } = renderHook(() => useSeatLayoutMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.movie).toEqual(movie);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles null id gracefully', () => {
    const { result } = renderHook(() => useSeatLayoutMovie(null));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.movie).toBeNull();
  });

  it('sets error on failure', async () => {
    mockGetMovieById.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useSeatLayoutMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.error).toBe('Network error');
    expect(result.current.movie).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('ignores AbortError', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mockGetMovieById.mockRejectedValue(abortError);
    const { result } = renderHook(() => useSeatLayoutMovie('movie1'));
    await act(async () => { await Promise.resolve(); });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSeatLayoutStatus } from '../../Components/SeatLayout/hooks/useSeatLayoutStatus';

describe('useSeatLayoutStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseProps = {
    requestKey: 'movie1|2026-05-23|10:30 AM',
    movie: { _id: 'movie1', title: 'Test Movie' },
    date: '2026-05-23',
    time: '10:30 AM',
    onReset: vi.fn(),
  };

  it('starts in loading status with resolving false (initial state matches requestKey)', () => {
    const { result } = renderHook(() => useSeatLayoutStatus(baseProps));
    expect(result.current.status).toBe('loading');
    expect(result.current.isResolving).toBe(false);
  });

  it('detects resolving state after key change before timeout fires', () => {
    const { result, rerender } = renderHook(
      (props) => useSeatLayoutStatus(props),
      { initialProps: baseProps }
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('ready');
    expect(result.current.isResolving).toBe(false);

    rerender({ ...baseProps, requestKey: 'changed-key' });
    expect(result.current.isResolving).toBe(true);
  });

  it('transitions to ready after timeout with valid props', () => {
    const { result } = renderHook(() => useSeatLayoutStatus(baseProps));
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('ready');
    expect(result.current.isResolving).toBe(false);
  });

  it('shows error when movie is missing', () => {
    const { result } = renderHook(() => useSeatLayoutStatus({ ...baseProps, movie: null }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Movie not found.');
  });

  it('shows error when date is missing', () => {
    const { result } = renderHook(() => useSeatLayoutStatus({ ...baseProps, date: null }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Missing show date.');
  });

  it('shows error when time is missing', () => {
    const { result } = renderHook(() => useSeatLayoutStatus({ ...baseProps, time: null }));
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Missing show time. Please pick a time slot.');
  });

  it('calls onReset when deps change', () => {
    const onReset = vi.fn();
    const { result, rerender } = renderHook(
      (props) => useSeatLayoutStatus(props),
      { initialProps: { ...baseProps, onReset } }
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.status).toBe('ready');

    rerender({ ...baseProps, onReset, date: '2026-05-24' });
    act(() => { vi.advanceTimersByTime(200); });
    expect(onReset).toHaveBeenCalled();
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useSeatLayoutStatus(baseProps));
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

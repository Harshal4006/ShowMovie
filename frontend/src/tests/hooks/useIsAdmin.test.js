import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserContext from '../../hooks/UserContext';
import useIsAdmin from '../../hooks/useIsAdmin';
import { createMockUserContext } from '../utils/renderWithProviders';
import { withWrapper } from '../utils/testWrappers';

describe('useIsAdmin', () => {
  it('returns isAdmin=true when role is admin', () => {
    const ctx = createMockUserContext({ role: 'admin', isAdmin: true, user: { role: 'admin' } });
    const { result } = renderHook(() => useIsAdmin(), { wrapper: withWrapper(UserContext, ctx) });
    expect(result.current.isAdmin).toBe(true);
  });

  it('returns isAdmin=false for regular user', () => {
    const ctx = createMockUserContext();
    const { result } = renderHook(() => useIsAdmin(), { wrapper: withWrapper(UserContext, ctx) });
    expect(result.current.isAdmin).toBe(false);
  });

  it('reflects loading state', () => {
    const ctx = createMockUserContext({ isLoading: true, isAuthLoaded: false });
    const { result } = renderHook(() => useIsAdmin(), { wrapper: withWrapper(UserContext, ctx) });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthLoaded).toBe(false);
  });
});

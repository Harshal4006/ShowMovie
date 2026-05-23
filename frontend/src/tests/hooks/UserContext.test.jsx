import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useUserContext } from '../../hooks/UserContext';
import { withWrapper } from '../utils/testWrappers';
import UserContext from '../../hooks/UserContext';
import { createMockUserContext } from '../utils/renderWithProviders';

describe('useUserContext', () => {
  it('throws error when used outside provider', () => {
    expect(() => renderHook(() => useUserContext())).toThrow('useUserContext must be used within UserProvider');
  });

  it('returns context value when used within provider', () => {
    const ctx = createMockUserContext({ isSignedIn: true, role: 'admin', isAdmin: true });
    const { result } = renderHook(() => useUserContext(), { wrapper: withWrapper(UserContext, ctx) });
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.role).toBe('admin');
  });

  it('returns default user values', () => {
    const ctx = createMockUserContext();
    const { result } = renderHook(() => useUserContext(), { wrapper: withWrapper(UserContext, ctx) });
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.role).toBe('user');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminRoute from '../../Components/RouteGuards/AdminRoute';
import UserContext from '../../hooks/UserContext';
import { createMockUserContext } from '../utils/renderWithProviders';
import { withWrapper } from '../utils/testWrappers';

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
  toast: { error: vi.fn() },
}));

describe('AdminRoute', () => {
  it('shows PageLoader when auth is loading', () => {
    const ctx = createMockUserContext({ isLoading: true, isAuthLoaded: false });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <AdminRoute><div>Admin Content</div></AdminRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects to home when user is not signed in', () => {
    const ctx = createMockUserContext({ isSignedIn: false });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <AdminRoute><div>Admin Content</div></AdminRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects to home when user is not admin', () => {
    const ctx = createMockUserContext({ isSignedIn: true, isAdmin: false, role: 'user' });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <AdminRoute><div>Admin Content</div></AdminRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders children when user is admin', () => {
    const ctx = createMockUserContext({ isSignedIn: true, isAdmin: true, role: 'admin' });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <AdminRoute><div>Admin Content</div></AdminRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});

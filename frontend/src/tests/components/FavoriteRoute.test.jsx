import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FavoriteRoute from '../../Components/RouteGuards/FavoriteRoute';
import UserContext from '../../hooks/UserContext';
import { createMockUserContext } from '../utils/renderWithProviders';

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
  toast: { error: vi.fn() },
}));

describe('FavoriteRoute', () => {
  it('shows PageLoader when auth is loading', () => {
    const ctx = createMockUserContext({ isLoading: true, isAuthLoaded: false });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <FavoriteRoute><div>Favorite Content</div></FavoriteRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Favorite Content')).not.toBeInTheDocument();
  });

  it('redirects to home when not signed in', () => {
    const ctx = createMockUserContext({ isSignedIn: false });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <FavoriteRoute><div>Favorite Content</div></FavoriteRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Favorite Content')).not.toBeInTheDocument();
  });

  it('renders children when user is signed in', () => {
    const ctx = createMockUserContext({ isSignedIn: true });
    render(
      <MemoryRouter>
        <UserContext.Provider value={ctx}>
          <FavoriteRoute><div>Favorite Content</div></FavoriteRoute>
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('Favorite Content')).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import UserContext from '../../hooks/UserContext';
import { vi } from 'vitest';

const mockClerkPubKey = 'pk_test_mock_key';

const defaultUserContext = {
  user: null,
  favoriteIds: [],
  favoriteMovies: {},
  setFavoriteIds: vi.fn(),
  setFavoriteMovies: vi.fn(),
  isMovieFavorite: vi.fn(() => false),
  role: 'user',
  isAdmin: false,
  isLoading: false,
  isAuthLoaded: true,
  error: null,
  isSignedIn: false,
  clearUser: vi.fn(),
  toggleFavorite: vi.fn(),
  refreshFavorites: vi.fn(),
};

export const renderWithProviders = (
  ui,
  {
    userContext = defaultUserContext,
    initialEntries = ['/'],
    clerkOptions = {},
  } = {}
) => {
  return render(
    <ClerkProvider publishableKey={mockClerkPubKey} {...clerkOptions}>
      <MemoryRouter initialEntries={initialEntries}>
        <UserContext.Provider value={userContext}>
          {ui}
        </UserContext.Provider>
      </MemoryRouter>
    </ClerkProvider>
  );
};

export const createMockUserContext = (overrides = {}) => ({
  ...defaultUserContext,
  ...overrides,
});

export { defaultUserContext };

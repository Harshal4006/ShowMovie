import { vi } from 'vitest';

export const mockUseAuth = vi.fn(() => ({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  sessionId: null,
  getToken: vi.fn(() => Promise.resolve('mock-token')),
  signOut: vi.fn(),
}));

export const mockUseUser = vi.fn(() => ({
  isLoaded: true,
  isSignedIn: false,
  user: null,
}));

vi.mock('@clerk/clerk-react', async () => {
  const actual = await vi.importActual('@clerk/clerk-react');
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
    useUser: () => mockUseUser(),
    ClerkProvider: ({ children }) => children,
    SignedIn: ({ children }) => children,
    SignedOut: ({ children }) => children,
    SignInButton: ({ children }) => children,
    UserButton: () => null,
    withClerk: (Component) => Component,
  };
});

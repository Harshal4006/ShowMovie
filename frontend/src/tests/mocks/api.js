import { vi } from 'vitest';

export const createMockApi = (overrides = {}) => {
  const defaults = {
    getMovies: vi.fn(),
    getMovieById: vi.fn(),
    getFeaturedMovies: vi.fn(),
    getTrendingMovies: vi.fn(),
    getMostPopularMovies: vi.fn(),
    getNowShowingMovies: vi.fn(),
    getUpcomingMovies: vi.fn(),
    getShows: vi.fn(),
    getShowById: vi.fn(),
    getShowsByMovie: vi.fn(),
    getOccupiedSeats: vi.fn(),
    getMyBookings: vi.fn(),
    createBooking: vi.fn(),
    createPaymentOrder: vi.fn(),
    verifyPayment: vi.fn(),
    getMe: vi.fn(),
    getNotifications: vi.fn(),
    markNotificationRead: vi.fn(),
    markAllNotificationsRead: vi.fn(),
    deleteNotification: vi.fn(),
    clearAllNotifications: vi.fn(),
    getAdminDashboard: vi.fn(),
    getAdminBookings: vi.fn(),
    getAdminMovies: vi.fn(),
    getAdminTheaters: vi.fn(),
    getTheaters: vi.fn(),
    getTheaterById: vi.fn(),
    syncUser: vi.fn(),
    searchTmdbMovies: vi.fn(),
    getTmdbMovieDetails: vi.fn(),
    getTmdbNowPlaying: vi.fn(),
    getTmdbUpcoming: vi.fn(),
    getTmdbTrending: vi.fn(),
    getTmdbPopular: vi.fn(),
  };

  return { ...defaults, ...overrides };
};

vi.mock('../../services/api', () => createMockApi());

export const mockRequest = vi.fn();
vi.mock('../../services/authClient', () => ({
  default: mockRequest,
  request: mockRequest,
  authRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(message, { status, data } = {}) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  },
}));

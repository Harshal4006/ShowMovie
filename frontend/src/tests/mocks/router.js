import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn(() => ({}));
const mockUseSearchParams = vi.fn(() => [new URLSearchParams(), vi.fn()]);
const mockUseLocation = vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null }));
const mockUseNavigate = vi.fn(() => mockNavigate);

export { mockNavigate, mockUseParams, mockUseSearchParams, mockUseLocation };

export const setupRouterMocks = () => {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      useParams: mockUseParams,
      useSearchParams: mockUseSearchParams,
      useLocation: mockUseLocation,
    };
  });
};

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from '../../Components/ErrorBoundary/ErrorBoundary';
import ErrorFallback from '../../Components/ErrorBoundary/ErrorFallback';

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Boundary test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders error fallback on error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Boundary test error')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    console.error.mockRestore();
  });

  it('renders ErrorFallback directly with reset handler', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ErrorFallback error={new Error('Custom error')} onReset={onReset} />
      </MemoryRouter>
    );

    expect(screen.getByText('Custom error')).toBeInTheDocument();

    await user.click(screen.getByText('Try Again'));

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

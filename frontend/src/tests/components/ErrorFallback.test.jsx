import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MemoErrorFallback from '../../Components/ErrorBoundary/ErrorFallback';

const renderFallback = (props = {}) => {
  return render(
    <MemoryRouter>
      <MemoErrorFallback error={new Error('Test error')} onReset={vi.fn()} {...props} />
    </MemoryRouter>
  );
};

describe('ErrorFallback', () => {
  it('renders error message', () => {
    renderFallback();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders default message when no error provided', () => {
    render(<MemoryRouter><MemoErrorFallback /></MemoryRouter>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders Try Again button', () => {
    renderFallback();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders Go Home link', () => {
    renderFallback();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Go Home').closest('a')).toHaveAttribute('href', '/');
  });

  it('calls onReset when Try Again clicked', async () => {
    const onReset = vi.fn();
    renderFallback({ onReset });
    const user = userEvent.setup();
    await user.click(screen.getByText('Try Again'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('has accessible buttons and links', () => {
    renderFallback();
    expect(screen.getByText('Try Again').closest('button')).toBeInTheDocument();
    expect(screen.getByText('Go Home').closest('a')).toBeInTheDocument();
  });
});

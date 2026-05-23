import '@testing-library/jest-dom';

// Mock window.matchMedia (used by prefers-reduced-motion, responsive checks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.Razorpay
global.Razorpay = class {
  constructor(options) {
    this.options = options;
  }
  on() {}
  open() {}
};

process.env.NODE_ENV = 'test';
process.env.CLERK_SECRET_KEY = 'test_clerk_secret';
process.env.RAZORPAY_KEY_ID = 'test_key_id';
process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/showmovie_test';

// Mock Clerk's getAuth
jest.mock('@clerk/express', () => {
  const mockGetAuth = jest.fn(() => ({
    userId: 'test_clerk_user_id',
    sessionId: 'test_session',
    getToken: jest.fn(() => Promise.resolve('test_token')),
  }));

  return {
    getAuth: mockGetAuth,
    clerkMiddleware: jest.fn((req, res, next) => next()),
    ClerkExpressWithAuth: jest.fn(() => (req, res, next) => next()),
    ClerkExpressRequireAuth: jest.fn(() => (req, res, next) => next()),
  };
});

// Mock razorpay
jest.mock('../Config/Razorpay', () => ({
  orders: {
    create: jest.fn(),
  },
}));

// Mock the Inngest
jest.mock('../Inngest/Inngest', () => ({
  inngest: {
    send: jest.fn(),
  },
  functions: [],
}));

// Mock ensureDbConnection
jest.mock('../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

// Mock Cloudinary
jest.mock('../Config/Cloudinary', () => ({
  uploader: {
    upload: jest.fn(() => Promise.resolve({ secure_url: 'https://cloudinary.com/test.jpg' })),
  },
}));

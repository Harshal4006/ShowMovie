jest.mock('@clerk/express', () => {
  const mockGetAuth = jest.fn();
  return {
    getAuth: mockGetAuth,
    clerkMiddleware: jest.fn((req, res, next) => next()),
  };
});

const { getAuth } = require('@clerk/express');

describe('AuthMiddleware', () => {
  let VerifyToken;

  beforeAll(() => {
    VerifyToken = require('../../Middleware/AuthMiddleware');
  });

  beforeEach(() => {
    getAuth.mockReset();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('calls next when user is authenticated', () => {
    getAuth.mockReturnValue({ userId: 'test_user_id' });
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    VerifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 401 when no userId', () => {
    getAuth.mockReturnValue({ userId: null });
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    VerifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No valid user session',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

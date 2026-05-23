jest.mock('@clerk/express', () => {
  const mockGetAuth = jest.fn();
  return {
    getAuth: mockGetAuth,
    clerkMiddleware: jest.fn((req, res, next) => next()),
  };
});

const { getAuth } = require('@clerk/express');

jest.mock('../../Models/User', () => ({
  findOne: jest.fn(),
}));

const User = require('../../Models/User');

jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

describe('AdminMiddleware', () => {
  let VerifyAdmin;

  beforeAll(() => {
    VerifyAdmin = require('../../Middleware/AdminMiddleware');
  });

  beforeEach(() => {
    getAuth.mockReset();
    User.findOne.mockReset();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('returns 401 when no userId', async () => {
    getAuth.mockReturnValue({ userId: null });
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await VerifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized. Please sign in.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user is not admin', async () => {
    getAuth.mockReturnValue({ userId: 'test_user' });
    User.findOne.mockResolvedValue({ clerkId: 'test_user', role: 'user' });

    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await VerifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access denied. Admin privileges required.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when user is admin', async () => {
    const user = { clerkId: 'test_user', role: 'admin', name: 'Admin' };
    getAuth.mockReturnValue({ userId: 'test_user' });
    User.findOne.mockResolvedValue(user);

    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await VerifyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(user);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 500 on error', async () => {
    getAuth.mockReturnValue({ userId: 'test_user' });
    User.findOne.mockRejectedValue(new Error('DB Error'));

    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    await VerifyAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error during authorization.',
    });
  });
});

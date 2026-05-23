jest.mock('@clerk/express', () => {
  const mockGetAuth = jest.fn();
  return {
    getAuth: mockGetAuth,
    clerkMiddleware: jest.fn((req, res, next) => next()),
  };
});

const { getAuth } = require('@clerk/express');

jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

jest.mock('../../Controllers/NotificationController', () => ({
  CreateNotification: jest.fn(),
}));

jest.mock('../../Models/User', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../Models/Show', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../Models/Booking', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
}));

const User = require('../../Models/User');
const Show = require('../../Models/Show');

describe('BookingController', () => {
  let BookingController;

  beforeAll(() => {
    BookingController = require('../../Controllers/BookingController');
  });

  beforeEach(() => {
    getAuth.mockReset();
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('CreateBooking', () => {
    const validReqBody = {
      showId: 'show_test123',
      bookedSeats: ['A1', 'A2'],
      amount: 360,
    };

    it('returns 401 when no userId', async () => {
      getAuth.mockReturnValue({ userId: null });
      const req = { body: validReqBody };
      const res = mockResponse();

      await BookingController.CreateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('returns 404 when user is not found', async () => {
      getAuth.mockReturnValue({ userId: 'test_user' });
      User.findOne.mockResolvedValue(null);
      const req = { body: validReqBody };
      const res = mockResponse();

      await BookingController.CreateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found. Please sign in again.',
      });
    });

    it('returns 404 when show is not found', async () => {
      getAuth.mockReturnValue({ userId: 'test_user' });
      User.findOne.mockResolvedValue({ _id: 'user_123', clerkId: 'test_user' });
      Show.findById.mockResolvedValue(null);
      const req = { body: validReqBody };
      const res = mockResponse();

      await BookingController.CreateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Show not found',
      });
    });

    it('returns 400 when seat is already occupied', async () => {
      getAuth.mockReturnValue({ userId: 'test_user' });
      User.findOne.mockResolvedValue({ _id: 'user_123', clerkId: 'test_user' });

      const occupiedSeats = new Map([['A1', 'other_user']]);
      Show.findById.mockResolvedValue({ _id: 'show_test123', occupiedSeats });

      const req = { body: validReqBody };
      const res = mockResponse();

      await BookingController.CreateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seat A1 is already booked',
      });
    });
  });
});

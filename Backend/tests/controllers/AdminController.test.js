jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

const mockBookingFind = {
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue([]),
};

jest.mock('../../Models/Booking', () => ({
  find: jest.fn(() => mockBookingFind),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
}));

jest.mock('../../Models/Movie', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../Models/Theater', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../../Models/User', () => ({
  countDocuments: jest.fn(),
}));

jest.mock('../../Controllers/NotificationController', () => ({
  CreateNotification: jest.fn(),
}));

jest.mock('axios');

const Booking = require('../../Models/Booking');

describe('AdminController', () => {
  let AdminController;

  beforeAll(() => {
    AdminController = require('../../Controllers/AdminController');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('GetAllBookings', () => {
    it('returns enriched bookings', async () => {
      const mockRawBooking = {
        _id: 'booking1',
        bookedSeats: ['A1'],
        amount: 200,
        isPaid: true,
        paymentId: 'pay_test',
        status: 'confirmed',
        createdAt: new Date('2024-01-01').toISOString(),
        show: {
          _id: 'show1',
          showDateTime: new Date(),
          showPrice: 200,
          theater: 'theater1',
          screenType: 'IMAX',
          language: 'English',
          movie: {
            _id: 'movie1',
            tmdbId: 123,
            title: 'Test Movie',
            posterPath: '/path.jpg',
            backdropPath: '/backdrop.jpg',
            posterUrl: 'https://example.com/poster.jpg',
            backdropUrl: 'https://example.com/backdrop.jpg',
            releaseDate: '2024-01-01',
            runtime: 120,
            genres: ['Action'],
            rating: 7.5,
            language: 'English',
            status: 'active',
          },
        },
      };
      mockBookingFind.lean.mockResolvedValue([mockRawBooking]);

      const req = {};
      const res = mockResponse();

      await AdminController.GetAllBookings(req, res);

      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({
          _id: 'booking1',
          bookedSeats: ['A1'],
          amount: 200,
          isPaid: true,
          paymentId: 'pay_test',
          status: 'confirmed',
        }),
      ]);
    });

    it('returns 500 on error', async () => {
      mockBookingFind.lean.mockRejectedValue(new Error('DB Error'));

      const req = {};
      const res = mockResponse();

      await AdminController.GetAllBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

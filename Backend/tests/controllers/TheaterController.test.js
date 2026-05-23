jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

jest.mock('../../Models/Theater', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../../Models/Movie', () => ({
  findById: jest.fn(),
}));

jest.mock('../../Config/Cloudinary', () => ({
  uploader: {
    upload: jest.fn(() => Promise.resolve({ secure_url: 'https://cloudinary.com/test.jpg' })),
  },
}));

const Theater = require('../../Models/Theater');
const Movie = require('../../Models/Movie');

describe('TheaterController', () => {
  let TheaterController;

  beforeAll(() => {
    TheaterController = require('../../Controllers/TheaterController');
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

  const mockPopulateQuery = (value) => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue(value),
  });

  describe('GetAllTheaters', () => {
    it('returns all active theaters', async () => {
      const theaters = [{ _id: '1', name: 'Theater 1', isActive: true }];
      Theater.find.mockReturnValue(mockPopulateQuery(theaters));

      const req = { query: {} };
      const res = mockResponse();

      await TheaterController.GetAllTheaters(req, res);

      expect(res.json).toHaveBeenCalledWith(theaters);
    });

    it('filters by search query', async () => {
      Theater.find.mockReturnValue(mockPopulateQuery([]));

      const req = { query: { search: 'IMAX' } };
      const res = mockResponse();

      await TheaterController.GetAllTheaters(req, res);

      expect(Theater.find).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: true })
      );
    });

    it('returns 500 on error', async () => {
      Theater.find.mockImplementation(() => { throw new Error('DB Error'); });

      const req = { query: {} };
      const res = mockResponse();

      await TheaterController.GetAllTheaters(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('GetTheaterById', () => {
    it('returns theater by id', async () => {
      const theater = { _id: '1', name: 'Theater 1' };
      Theater.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(theater),
      });

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await TheaterController.GetTheaterById(req, res);

      expect(res.json).toHaveBeenCalledWith(theater);
    });

    it('returns 404 when theater not found', async () => {
      Theater.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const req = { params: { id: 'nonexistent' } };
      const res = mockResponse();

      await TheaterController.GetTheaterById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('DeleteTheater', () => {
    it('deletes theater successfully', async () => {
      Theater.findByIdAndDelete.mockResolvedValue({ _id: '1', name: 'Theater 1' });

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await TheaterController.DeleteTheater(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Theater deleted successfully',
      });
    });

    it('returns 404 when theater not found', async () => {
      Theater.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 'nonexistent' } };
      const res = mockResponse();

      await TheaterController.DeleteTheater(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

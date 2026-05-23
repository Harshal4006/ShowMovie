process.env.TMDB_ACCESS_TOKEN = 'test_token';

jest.mock('axios');
jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

const axios = require('axios');

describe('TMDBController', () => {
  let TMDBController;

  beforeAll(() => {
    TMDBController = require('../../Controllers/TMDBController');
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

  it('GetNowPlayingMovies returns movies with results array', async () => {
    axios.get.mockResolvedValue({ data: { results: [{ id: 1, title: 'Movie 1' }], total_results: 1, page: 1 } });

    const req = { query: { page: '1' } };
    const res = mockResponse();

    await TMDBController.GetNowPlayingMovies(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalResults: 1 })
    );
  });

  it('GetNowPlayingMovies returns 500 on error', async () => {
    axios.get.mockRejectedValue(new Error('TMDB error'));

    const req = { query: { page: '1' } };
    const res = mockResponse();

    await TMDBController.GetNowPlayingMovies(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('GetUpcomingMovies returns upcoming movies', async () => {
    axios.get.mockResolvedValue({ data: { results: [{ id: 3, title: 'Upcoming 1' }], total_results: 1, page: 1 } });

    const req = { query: { page: '1' } };
    const res = mockResponse();

    await TMDBController.GetUpcomingMovies(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalResults: 1 })
    );
  });

  it('GetTrendingMovies returns trending movies', async () => {
    axios.get.mockResolvedValue({ data: { results: [{ id: 5, title: 'Trending 1' }], total_results: 1, page: 1 } });

    const req = { query: { page: '1' } };
    const res = mockResponse();

    await TMDBController.GetTrendingMovies(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalResults: 1 })
    );
  });

  it('GetPopularMovies returns popular movies', async () => {
    axios.get.mockResolvedValue({ data: { results: [{ id: 6, title: 'Popular 1' }], total_results: 1, page: 1 } });

    const req = { query: { page: '1' } };
    const res = mockResponse();

    await TMDBController.GetPopularMovies(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ totalResults: 1 })
    );
  });
});

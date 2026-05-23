// TMDB API proxy - fetches movies, details, genres, credits, etc.

const axios = require('axios');

// Proxy to TMDB API - fetch currently playing movies
const GetNowPlayingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      movies: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies from TMDB', error: error.message });
  }
};

// Proxy to TMDB API - fetch full movie details by TMDB ID
const GetMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie details from TMDB' });
  }
};

// Proxy to TMDB API - fetch available movie genres
const GetMovieGenres = async (req, res) => {
  try {
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data.genres);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch genres from TMDB' });
  }
};

// Proxy to TMDB API - search movies by query string
const SearchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      movies: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search movies from TMDB', error: error.message });
  }
};

// Proxy to TMDB API - fetch cast and crew for a movie
const GetMovieCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie credits from TMDB' });
  }
};

// Proxy to TMDB API - fetch trailers and videos for a movie
const GetMovieVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ message: 'TMDB API key not configured' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie videos from TMDB' });
  }
};

// Proxy to TMDB API - fetch weekly trending movies
const GetTrendingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    if (!accessToken) return res.status(500).json({ message: 'TMDB API key not configured' });
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json({ movies: response.data.results, page: response.data.page, totalPages: response.data.total_pages, totalResults: response.data.total_results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trending movies', error: error.message });
  }
};

// Proxy to TMDB API - fetch upcoming movies
const GetUpcomingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    if (!accessToken) return res.status(500).json({ message: 'TMDB API key not configured' });
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json({ movies: response.data.results, page: response.data.page, totalPages: response.data.total_pages, totalResults: response.data.total_results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming movies', error: error.message });
  }
};

// Proxy to TMDB API - fetch popular movies
const GetPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    if (!accessToken) return res.status(500).json({ message: 'TMDB API key not configured' });
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json({ movies: response.data.results, page: response.data.page, totalPages: response.data.total_pages, totalResults: response.data.total_results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch popular movies', error: error.message });
  }
};

module.exports = {
  GetNowPlayingMovies,
  GetMovieDetails,
  GetMovieGenres,
  SearchMovies,
  GetMovieCredits,
  GetMovieVideos,
  GetTrendingMovies,
  GetUpcomingMovies,
  GetPopularMovies,
};
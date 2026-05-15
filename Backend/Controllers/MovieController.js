const Movie = require('../Models/Movie');

const GetAllMovies = async (req, res) => {
  try {
    const { genre, search, sort, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (genre && genre !== 'all') {
      query['genres.name'] = genre;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'rating') sortOption = { vote_average: -1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'oldest') sortOption = { release_date: 1 };
    else sortOption = { release_date: -1 };

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.json({ movies, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetRelatedMovies = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const genreIds = movie.genres.map(g => g.id);
    const related = await Movie.find({
      _id: { $ne: movie._id },
      'genres.id': { $in: genreIds },
      isActive: true
    }).limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { GetAllMovies, GetMovieById, GetRelatedMovies };
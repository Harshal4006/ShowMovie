const mongoose = require('mongoose');
const Movie = require('./Models/Movie');
const axios = require('axios');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
    };
    const res = await axios.get(`${process.env.TMDB_BASE_URL}/movie/popular?language=en-US&page=1`, { headers });
    const list = res.data.results.slice(0, 5);
    for (const m of list) {
      const exists = await Movie.findOne({ tmdbId: m.id });
      if (exists) {
        console.log('exists');
        continue;
      }
      const detail = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${m.id}?language=en-US&append_to_response=credits,videos`, { headers });
      const trailer = detail.data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      const cast = (detail.data.credits?.cast || []).slice(0, 6).map(c => ({
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `${process.env.TMDB_IMAGE_BASE_URL}/w200${c.profile_path}` : null
      }));
      await Movie.create({
        tmdbId: m.id,
        title: m.title,
        overview: m.overview,
        posterPath: m.poster_path,
        backdropPath: m.backdrop_path,
        posterUrl: m.poster_path ? `${process.env.TMDB_IMAGE_BASE_URL}/w500${m.poster_path}` : null,
        backdropUrl: m.backdrop_path ? `${process.env.TMDB_IMAGE_BASE_URL}/w1280${m.backdrop_path}` : null,
        releaseDate: m.release_date,
        runtime: detail.data.runtime,
        genres: detail.data.genres,
        rating: m.vote_average,
        voteCount: m.vote_count,
        language: m.original_language,
        tagline: detail.data.tagline,
        trailerKey: trailer?.key || null,
        cast,
        price: 250,
        movieLanguage: 'English',
        format: '2D',
        status: 'active',
        isFeatured: true,
        isTrending: true,
        isMostPopular: true
      });
      console.log('added');
    }
    console.log('done');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('err');
    process.exit(1);
  }
}

run();

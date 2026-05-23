// Home page - landing page with hero, featured, trending, and about sections
import { useState, useEffect } from 'react'

import Hero from '../../Components/HeroSection/HeroSection.jsx'
import MovieSection from '../../Components/FeatureSection/MovieSection.jsx'
import TrailerSection from '../../Components/TrailerSection/TrailerSection.jsx'
import AboutSection from '../../Components/AboutSection/AboutSection.jsx'
import { HeroSkeleton } from '../../Components/Skeletons'

import { getFeaturedMovies, getTrendingMovies, getMostPopularMovies } from '../../services/api'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <>
          <Hero />
          <MovieSection
            title="Featured Movies"
            subtitle="Handpicked stories, crowd favorites, and fresh releases ready for your next movie night."
            fetchFn={getFeaturedMovies}
            sectionKey="featured"
          />
          <MovieSection
            title="Trending Movies"
            subtitle="Movies everyone's talking about right now. Don't miss out!"
            fetchFn={getTrendingMovies}
            sectionKey="trending"
          />
          <MovieSection
            title="Most Popular"
            subtitle="Top-rated movies loved by audiences worldwide."
            fetchFn={getMostPopularMovies}
            sectionKey="mostPopular"
          />
          <TrailerSection />
          <AboutSection />
        </>
      )}
    </>
  )
}

export default Home

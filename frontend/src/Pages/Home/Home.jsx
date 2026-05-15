import React, { useState, useEffect } from 'react'
import Hero from '../../Components/HeroSection/HeroSection.jsx'
import FeatureSection from '../../Components/FeatureSection/FeatureSection.jsx'
import TrailerSection from '../../Components/TrailerSection/TrailerSection.jsx'
import AboutSection from '../../Components/AboutSection/AboutSection.jsx'
import { HeroSkeleton, MovieGridSkeleton } from '../../Components/Skeletons'

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
          <FeatureSection />
          <TrailerSection />
          <AboutSection />
        </>
      )}
    </>
  )
}

export default Home

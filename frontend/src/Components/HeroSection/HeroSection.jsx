import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import heroVideo from "../../assets/cinema-hero-background.mp4";
import './HeroSection.css'

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        fetchpriority="high"
        onEnded={handleVideoEnded}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="hero-text text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          Book Your Movie Experience
        </h1>

        <p className="mt-4 text-gray-300 text-sm md:text-lg">
          Discover the latest releases, choose your seats, and enjoy every show
          without the hassle.
        </p>

        <p className="mt-2 italic text-gray-400 text-xs sm:text-sm">
          “Where stories come alive on the big screen 🎬”
        </p>

        <button
          type="button"
          onClick={() => navigate("/movies")}
          className="mt-6 px-7 py-3 rounded-full bg-red-600 hover:bg-red-500 transition cursor-pointer "
        >
          Explore Movies
        </button>
      </div>
    </div>
  );
};

export default Hero;

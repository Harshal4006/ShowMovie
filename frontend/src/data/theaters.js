import pvrImage from "../assets/Theaters Img/PVR IMAX.png";
import inoxImage from "../assets/Theaters Img/INOX.png";
import cinepolisImage from "../assets/Theaters Img/Cinepolis.png";
import movieMaxImage from "../assets/Theaters Img/MovieMax.png";
import mirajImage from "../assets/Theaters Img/Miraj Cinemas.png";
import carnivalImage from "../assets/Theaters Img/Carnival Cinemas.png";
import mamiImage from "../assets/Theaters Img/MAMI Cinemas.png";
import waveImage from "../assets/Theaters Img/Wave Cinemas.png";

const theaters = [
  {
    id: 1,
    name: "PVR IMAX",
    location: "Phoenix Mall, Lower Parel",
    city: "Mumbai",
    image: pvrImage,
    rating: 4.5,
    screens: 8,
    facilities: ["IMAX", "Dolby Atmos", "Parking", "Recliner Seats", "Food Court"],
    description: "Experience world-class cinema with IMAX screens and Dolby Atmos sound at PVR Cinemas, Mumbai's premier entertainment destination.",
    featured: true,
  },
  {
    id: 2,
    name: "INOX",
    location: "Inorbit Mall, Malad West",
    city: "Mumbai",
    image: inoxImage,
    rating: 4.3,
    screens: 6,
    facilities: ["Dolby Atmos", "Parking", "Recliner Seats", "VIP Lounge"],
    description: "INOX brings luxury cinema to life with plush recliner seats, crystal-clear projection, and immersive surround sound.",
  },
  {
    id: 3,
    name: "Cinepolis",
    location: "R City Mall, Ghatkopar West",
    city: "Mumbai",
    image: cinepolisImage,
    rating: 4.2,
    screens: 5,
    facilities: ["4DX", "Parking", "Food Court", "Recliner Seats"],
    description: "Cinepolis offers a unique 4DX experience with motion seats and environmental effects that bring movies to life.",
  },
  {
    id: 4,
    name: "MovieMax",
    location: "Sunset Mall, Goregaon West",
    city: "Mumbai",
    image: movieMaxImage,
    rating: 4.0,
    screens: 4,
    facilities: ["Dolby Atmos", "Parking", "Food Court"],
    description: "MovieMax delivers premium movie experiences with state-of-the-art Dolby Atmos technology and comfortable seating.",
  },
  {
    id: 5,
    name: "Miraj Cinemas",
    location: "Oberoi Mall, Goregaon East",
    city: "Mumbai",
    image: mirajImage,
    rating: 4.1,
    screens: 7,
    facilities: ["IMAX", "Parking", "Recliner Seats", "VIP Lounge", "Food Court"],
    description: "Miraj Cinemas combines IMAX grandeur with VIP luxury lounges for the ultimate cinematic experience.",
  },
  {
    id: 6,
    name: "Carnival Cinemas",
    location: "R City Mall, Ghatkopar",
    city: "Mumbai",
    image: carnivalImage,
    rating: 3.9,
    screens: 3,
    facilities: ["Parking", "Food Court", "Recliner Seats"],
    description: "Carnival Cinemas offers affordable luxury with comfortable recliner seats and a wide range of movie options.",
  },
  {
    id: 7,
    name: "MAMI Cinemas",
    location: "NCPA, Nariman Point",
    city: "Mumbai",
    image: mamiImage,
    rating: 4.6,
    screens: 2,
    facilities: ["Dolby Atmos", "VIP Lounge", "Parking"],
    description: "MAMI Cinemas is a boutique theater experience showcasing curated films, classics, and independent cinema in an intimate setting.",
  },
  {
    id: 8,
    name: "Wave Cinemas",
    location: "High Street Phoenix, Lower Parel",
    city: "Mumbai",
    image: waveImage,
    rating: 4.4,
    screens: 6,
    facilities: ["IMAX", "Dolby Atmos", "4DX", "Parking", "Recliner Seats", "Food Court"],
    description: "Wave Cinemas is a premium multiplex featuring IMAX, 4DX, and Dolby Atmos for an unmatched movie experience.",
  },
];

export default theaters;

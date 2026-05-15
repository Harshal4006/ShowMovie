import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToastProvider from "./Components/ToastProvider/ToastProvider";
import PageLoader from "./Components/PageLoader/PageLoader.jsx";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary.jsx";

// Lazy load pages for code splitting
const Home = lazy(() => import("./Pages/Home/Home.jsx"));
const Movies = lazy(() => import("./Pages/Movies/Movies.jsx"));
const MovieDetails = lazy(() => import("./Pages/MovieDetails/MovieDetailse.jsx"));
const SeatLayout = lazy(() => import("./Pages/SeatLayout/SeatLayout.jsx"));
const MyBooking = lazy(() => import("./Pages/MyBooking/MyBooking.jsx"));
const Favorite = lazy(() => import("./Pages/Favorite/Favorite.jsx"));

// Admin pages
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard.jsx"));
const AddShow = lazy(() => import("./Pages/Admin/AddShow.jsx"));
const ListShows = lazy(() => import("./Pages/Admin/ListShows.jsx"));
const ListBookings = lazy(() => import("./Pages/Admin/ListBookings.jsx"));

// Non-lazy components (used on all pages)
import AnimatedBackground from "./Components/AnimatedBackground/AnimatedBackground.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <AnimatedBackground />

      <ToastProvider />

      <div className="relative z-10">
        {!isAdminRoute && <Navbar />}

        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/movies/:id/:date" element={<SeatLayout />} />
              <Route path="/my-booking" element={<MyBooking />} />
              <Route path="/favorite" element={<Favorite />} />
                {/* Admin Routes */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/add-show" element={<AddShow />} />
                <Route path="/admin/list-shows" element={<ListShows />} />
                <Route path="/admin/list-bookings" element={<ListBookings />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>

        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
};

export default App;

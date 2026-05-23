import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToastProvider from "./Components/ToastProvider/ToastProvider";
import PageLoader from "./Components/PageLoader/PageLoader.jsx";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary.jsx";
import AdminRoute from "./Components/RouteGuards/AdminRoute.jsx";

import FavoriteRoute from "./Components/RouteGuards/FavoriteRoute.jsx";
// Lazy load pages for code splitting
const Home = lazy(() => import("./Pages/Home/Home.jsx"));
const Movies = lazy(() => import("./Pages/Movies/Movies.jsx"));
const MovieDetails = lazy(() => import("./Pages/MovieDetails/MovieDetailse.jsx"));
const SeatLayout = lazy(() => import("./Pages/SeatLayout/SeatLayout.jsx"));
const MyBooking = lazy(() => import("./Pages/MyBooking/MyBooking.jsx"));
const Theaters = lazy(() => import("./Pages/Theaters/Theaters.jsx"));
const TheaterDetails = lazy(() => import("./Pages/Theaters/TheaterDetails.jsx"));
const Releases = lazy(() => import("./Pages/Releases/Releases.jsx"));
const Favorite = lazy(() => import("./Pages/Favorite/Favorite.jsx"));

// Admin pages
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard.jsx"));
const AddShow = lazy(() => import("./Pages/Admin/AddShow.jsx"));
const ListShows = lazy(() => import("./Pages/Admin/ListShows.jsx"));
const ListBookings = lazy(() => import("./Pages/Admin/ListBookings.jsx"));
const ListMovies = lazy(() => import("./Pages/Admin/ListMovies.jsx"));
const ManageTheaters = lazy(() => import("./Pages/Admin/ManageTheaters.jsx"));

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
              <Route path="/theaters" element={<Theaters />} />
              <Route path="/theaters/:id" element={<TheaterDetails />} />
              <Route path="/releases" element={<Releases />} />
              <Route path="/favorite" element={<FavoriteRoute><Favorite /></FavoriteRoute>} />

              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-show"
                element={
                  <AdminRoute>
                    <AddShow />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/list-shows"
                element={
                  <AdminRoute>
                    <ListShows />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/list-bookings"
                element={
                  <AdminRoute>
                    <ListBookings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/manage-theaters"
                element={
                  <AdminRoute>
                    <ManageTheaters />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/list-movies"
                element={
                  <AdminRoute>
                    <ListMovies />
                  </AdminRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Suspense>

        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
};

export default App;

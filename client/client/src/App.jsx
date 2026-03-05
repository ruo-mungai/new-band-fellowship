import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';


// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import BlogsPage from './pages/public/BlogsPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';
import PlaylistPage from './pages/public/PlaylistPage';
import SongLyricsPage from './pages/public/SongLyricsPage';
import DonationsPage from './pages/public/DonationsPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// User Pages
import UserDashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import MyRequestsPage from './pages/user/MyRequestsPage';
import RequestSongPage from './pages/user/RequestSongPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageEvents from './pages/admin/ManageEvents';
import ManageRequests from './pages/admin/ManageRequests';
import ManagePlaylist from './pages/admin/ManagePlaylist';
import ManageLanding from './pages/admin/ManageLanding';
import ManageGallery from './pages/admin/ManageGallery';
import ManageSongs from './pages/admin/ManageSongs';
import ManageSessions from './pages/admin/ManageSessions';
import ManageTeam from './pages/admin/ManageTeam';
import SystemSettings from './pages/admin/SystemSettings';
import ManageAdmins from './pages/admin/SuperAdmin/ManageAdmins';
import SystemLogs from './pages/admin/SuperAdmin/SystemLogs';

// Loading wrapper component
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading application..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* ALL PUBLIC ROUTES - NO LOGIN REQUIRED */}
      <Route element={<MainLayout />}>
        {/* Public Pages - Anyone can access */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/playlist" element={<PlaylistPage />} />
        <Route path="/playlist/:eventId" element={<PlaylistPage />} />
        <Route path="/songs/:songId" element={<SongLyricsPage />} />
        <Route path="/songs/:songId/playlist/:playlistId" element={<SongLyricsPage />} />
        <Route path="/songs/:songId/playlist/:playlistId/event/:eventId" element={<SongLyricsPage />} />
         <Route path="/donate" element={<DonationsPage />} />
      </Route>
     

      {/* Auth Routes - for non-authenticated users */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected User Routes - Login Required */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/request-song" element={<RequestSongPage />} />
        </Route>
      </Route>

      {/* Admin Routes - Admin Only */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/blogs" element={<ManageBlogs />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/requests" element={<ManageRequests />} />
          <Route path="/admin/playlist" element={<ManagePlaylist />} />
          <Route path="/admin/landing" element={<ManageLanding />} />
          <Route path="/admin/gallery" element={<ManageGallery />} />
          <Route path="/admin/songs" element={<ManageSongs />} />
          <Route path="/admin/sessions" element={<ManageSessions />} />
          <Route path="/admin/team" element={<ManageTeam />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          
          {/* Super Admin Only */}
          <Route path="/admin/admins" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <ManageAdmins />
            </ProtectedRoute>
          } />
          <Route path="/admin/logs" element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SystemLogs />
            </ProtectedRoute>
          } />
        </Route>
      </Route>

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#f97316',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <AppContent />
            
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
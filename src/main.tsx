import 'leaflet/dist/leaflet.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Statistic from './pages/Statistic';
import Tracker from './pages/Tracker';
import FavoriteFood from './pages/FavoriteFood';
import AverageNutrition from './pages/AverageNutrition';
import Leaderboard from './pages/Leaderboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRoles={["Government"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/tracker" element={<ProtectedRoute requiredRoles={["Government"]}><Tracker /></ProtectedRoute>} />
          <Route path="/statistic" element={<ProtectedRoute requiredRoles={["Government"]}><Statistic /></ProtectedRoute>} />
          <Route path="/favorite-food" element={<ProtectedRoute requiredRoles={["Government"]}><FavoriteFood /></ProtectedRoute>} />
          <Route path="/average-nutrition" element={<ProtectedRoute requiredRoles={["Government"]}><AverageNutrition /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute requiredRoles={["Government"]}><Leaderboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)

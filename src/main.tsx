import 'leaflet/dist/leaflet.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import Dashboard from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Statistic from './pages/Statistic';
import Tracker from './pages/Tracker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/statistic" element={<Statistic />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>
)

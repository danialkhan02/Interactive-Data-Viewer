'use client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './Dashboard';
import ScatterplotPage from '../pages/ScatterplotPage';

export default function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scatterplot" element={<ScatterplotPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
} 
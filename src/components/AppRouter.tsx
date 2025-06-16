'use client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './Dashboard';
import ScatterplotPage from '../pages/ScatterplotPage';
import HistogramPage from '../pages/HistogramPage';
import FilterPage from '../pages/FilterPage';

export default function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scatterplot" element={<ScatterplotPage />} />
          <Route path="/histogram" element={<HistogramPage />} />
          <Route path="/filters" element={<FilterPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
} 
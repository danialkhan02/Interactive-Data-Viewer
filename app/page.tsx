'use client';

import { useRouter, usePathname } from 'next/navigation';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/Dashboard';
import ScatterplotPage from './pages/ScatterplotPage';
import HistogramPage from './pages/HistogramPage';
import FilterPage from './pages/FilterPage';

type ViewType = 'dashboard' | 'scatterplot' | 'histogram' | 'filters';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  // Get current view based on pathname
  const getCurrentView = (): ViewType => {
    switch (pathname) {
      case '/scatterplot':
        return 'scatterplot';
      case '/histogram':
        return 'histogram';
      case '/filters':
        return 'filters';
      case '/':
      default:
        return 'dashboard';
    }
  };

  const currentView = getCurrentView();

  const handleViewChange = (view: ViewType) => {
    switch (view) {
      case 'scatterplot':
        router.push('/scatterplot');
        break;
      case 'histogram':
        router.push('/histogram');
        break;
      case 'filters':
        router.push('/filters');
        break;
      case 'dashboard':
      default:
        router.push('/');
        break;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'scatterplot':
        return <ScatterplotPage />;
      case 'histogram':
        return <HistogramPage />;
      case 'filters':
        return <FilterPage />;
      case 'dashboard':
      default:
        return <Dashboard onViewChange={handleViewChange} />;
    }
  };

  return (
    <MainLayout currentView={currentView} onViewChange={handleViewChange}>
      {renderContent()}
    </MainLayout>
  );
}

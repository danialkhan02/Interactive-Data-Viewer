'use client';

import { Layout } from 'antd';
import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate content margin based on sidebar state
  const contentMarginLeft = '0px';

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header className="fixed top-0 left-0 right-0 z-50" />
      
      {/* Main Layout Container */}
      <Layout className="pt-16"> {/* Add padding-top to account for fixed header */}
        {/* Sidebar */}
        <Sidebar 
          className="fixed left-0 top-0 bottom-0 z-40"
          onCollapse={setSidebarCollapsed}
          collapsed={sidebarCollapsed}
        />
        
        {/* Content Area */}
        <Content 
          className="min-h-screen bg-white transition-all duration-300"
          style={{
            marginLeft: isMobile ? '0' : contentMarginLeft,
            padding: isMobile ? '16px' : '16px 16px 16px 8px',
            minHeight: 'calc(100vh - 64px)', // Full height minus header
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 
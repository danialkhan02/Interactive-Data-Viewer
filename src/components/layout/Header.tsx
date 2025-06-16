'use client';

import { Layout, Typography, Menu, Button } from 'antd';
import { 
  BarChartOutlined, 
  DotChartOutlined, 
  FilterOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { useState } from 'react';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const menuItems = [
    {
      key: 'scatterplot',
      icon: <DotChartOutlined />,
      label: 'Scatterplot',
    },
    {
      key: 'histogram',
      icon: <BarChartOutlined />,
      label: 'Histogram',
    },
    {
      key: 'filters',
      icon: <FilterOutlined />,
      label: 'Data Filters',
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    console.log('Navigate to:', e.key);
    // TODO: Add navigation logic when routing is implemented
    setMobileMenuVisible(false);
  };

  return (
    <AntHeader 
      className={`${className} bg-white shadow-sm border-b border-gray-200`}
      style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #f0f0f0' }}
    >
      <div className="flex items-center h-full w-full px-6 relative">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Uncountable Logo" className="w-50 h-10" />
        </div>
        
        {/* Title - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Title level={3} className="m-0 text-gray-800 hidden sm:block">
            Interactive Data Viewer
          </Title>
        </div>
      </div>
    </AntHeader>
  );
} 
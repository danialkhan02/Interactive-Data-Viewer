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
      style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0' }}
    >
      <div className="flex items-center justify-between h-full w-full px-6"
           style={{ paddingLeft: '280px' }}>
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <BarChartOutlined className="text-white text-lg" />
            </div>
            <Title level={3} className="m-0 text-gray-800 hidden sm:block">
              Interactive Data Viewer
            </Title>
            <Title level={4} className="m-0 text-gray-800 block sm:hidden">
              Data Viewer
            </Title>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Menu
            mode="horizontal"
            items={menuItems}
            onClick={handleMenuClick}
            className="border-none bg-transparent"
            style={{ lineHeight: '64px' }}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            className="text-gray-600"
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuVisible && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <Menu
            mode="vertical"
            items={menuItems}
            onClick={handleMenuClick}
            className="border-none"
          />
        </div>
      )}
    </AntHeader>
  );
} 
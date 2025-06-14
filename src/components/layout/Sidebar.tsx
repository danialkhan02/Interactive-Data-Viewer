'use client';

import { Layout, Menu, Button, Typography } from 'antd';
import { 
  BarChartOutlined, 
  DotChartOutlined, 
  FilterOutlined, 
  HeatMapOutlined, 
  SearchOutlined, 
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
  collapsed?: boolean;
}

export default function Sidebar({ 
  className, 
  onCollapse, 
  collapsed: controlledCollapsed 
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleCollapse = (newCollapsed: boolean) => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapse?.(newCollapsed);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      type: 'divider' as const,
    },
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
      key: 'correlation',
      icon: <HeatMapOutlined />,
      label: 'Correlation Matrix',
    },
    {
      key: 'trends',
      icon: <LineChartOutlined />,
      label: 'Time Trends',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'filters',
      icon: <FilterOutlined />,
      label: 'Data Filters',
    },
    {
      key: 'similarity',
      icon: <SearchOutlined />,
      label: 'Similarity Search',
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case 'dashboard':
        navigate('/');
        break;
      case 'scatterplot':
        navigate('/scatterplot');
        break;
      default:
        console.log('Navigation not implemented for:', e.key);
    }
  };

  // Get current selected menu key based on location
  const getCurrentMenuKey = () => {
    switch (location.pathname) {
      case '/':
        return ['dashboard'];
      case '/scatterplot':
        return ['scatterplot'];
      default:
        return ['dashboard'];
    }
  };

  const toggleCollapsed = () => {
    handleCollapse(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      width={256}
      className={`${className} bg-white`}
      style={{ backgroundColor: '#ffffff', border: 'none' }}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={80}
    >
      <div className="h-full flex flex-col pt-16">
        {/* Sidebar Header */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                  <BarChartOutlined className="text-white text-sm" />
                </div>
                <Text strong className="text-gray-800">
                  Navigation
                </Text>
              </div>
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className="text-gray-600"
              size="small"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto pt-2">
          <Menu
            mode="inline"
            selectedKeys={getCurrentMenuKey()}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-none h-full"
            inlineCollapsed={collapsed}
            style={{ borderRight: 0, paddingTop: 0 }}
          />
        </div>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <div>Interactive Data Viewer</div>
              <div className="mt-1">v1.0.0</div>
            </div>
          </div>
        )}
      </div>
    </Sider>
  );
} 
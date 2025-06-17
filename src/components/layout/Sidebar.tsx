'use client';

import { Layout, Menu, Button, Typography } from 'antd';
import { 
  BarChartOutlined, 
  DotChartOutlined, 
  FilterOutlined,
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
      key: 'filters',
      icon: <FilterOutlined />,
      label: 'Data Filters',
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
      case 'histogram':
        navigate('/histogram');
        break;
      case 'filters':
        navigate('/filters');
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
      case '/histogram':
        return ['histogram'];
      case '/filters':
        return ['filters'];
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
      style={{ backgroundColor: '#FAFAFA', border: 'none' }}
      trigger={null}
      collapsedWidth={80}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center">
                <Text strong className="ml-2 text-gray-800">
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
            style={{ backgroundColor: '#FAFAFA', borderRight: 0, paddingTop: 0 }}
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
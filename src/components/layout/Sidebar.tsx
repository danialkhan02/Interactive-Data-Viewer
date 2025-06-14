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

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

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
    console.log('Sidebar navigate to:', e.key);
    // TODO: Add navigation logic when routing is implemented
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={256}
      className={`${className} bg-white border-r border-gray-200`}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={80}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
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
        <div className="flex-1 overflow-y-auto">
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-none h-full"
            inlineCollapsed={collapsed}
            style={{ borderRight: 0 }}
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
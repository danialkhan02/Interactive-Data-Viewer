'use client';

import { Layout } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <AntHeader 
      className={`${className} bg-white shadow-sm border-b border-gray-200`}
      style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #f0f0f0' }}
    >
      <div className="flex items-center h-full w-full px-6 relative">
        {/* Logo - Left side */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/assets/logo.png" alt="Uncountable Logo" className="w-50 h-10" />
        </div>
      </div>
    </AntHeader>
  );
} 
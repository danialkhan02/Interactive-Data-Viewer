'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

interface AntdProviderProps {
  children: ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
} 
'use client';

import { Button, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <Space direction="vertical" align="center" size="large">
        <Title level={1}>Interactive Data Viewer</Title>
        <Paragraph className="text-center text-lg">
          Uncountable Frontend Assignment - Next.js App with Ant Design components.
        </Paragraph>
        
        <Space size="middle">
          <Button type="primary" size="large">
            Primary Button
          </Button>
          <Button size="large">
            Default Button
          </Button>
          <Button type="dashed" size="large">
            Dashed Button
          </Button>
        </Space>
        
        <Paragraph className="text-center text-gray-600">
          Ant Design components are working correctly.
        </Paragraph>
      </Space>
    </div>
  );
}

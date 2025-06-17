'use client';

import { Space, Typography } from 'antd';
import dynamic from 'next/dynamic';

const HistogramViewer = dynamic(() => import('../components/charts/HistogramViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-96">Loading chart...</div>
});

const { Title, Paragraph } = Typography;

export default function HistogramPage() {
  return (
    <div className="w-full">
      <Space direction="vertical" size="large" className="w-full">
        {/* Page Header */}
        <div>
          <Title level={2} className="mb-2">Distribution Analysis</Title>
          <Paragraph className="text-gray-600 text-lg">
            Visualize data distributions and frequency patterns with interactive histograms
          </Paragraph>
        </div>

        {/* Histogram Visualization */}
        <HistogramViewer height={600} />
      </Space>
    </div>
  );
} 
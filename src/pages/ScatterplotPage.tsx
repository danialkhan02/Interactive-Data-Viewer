'use client';

import { Card, Row, Col, Space, Typography } from 'antd';
import PropertySelector from '../components/ui/PropertySelector';
import ScatterPlot from '../components/charts/ScatterPlot';

const { Title, Paragraph } = Typography;

export default function ScatterplotPage() {
  return (
    <div className="w-full">
      <Space direction="vertical" size="large" className="w-full">
        {/* Page Header */}
        <div>
          <Title level={2} className="mb-2">Scatterplot Analysis</Title>
          <Paragraph className="text-gray-600 text-lg">
            Explore relationships between variables with interactive scatter plots
          </Paragraph>
        </div>

        {/* Property Selection */}
        <Card title="Property Selection" className="shadow-sm">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <PropertySelector 
                type="input" 
                placeholder="Select input property (X-axis)..."
                multiple={false}
              />
            </Col>
            <Col xs={24} md={12}>
              <PropertySelector 
                type="output" 
                placeholder="Select output property (Y-axis)..."
                multiple={false}
              />
            </Col>
          </Row>
        </Card>

        {/* Scatterplot Visualization */}
        <ScatterPlot height={600} />
      </Space>
    </div>
  );
} 
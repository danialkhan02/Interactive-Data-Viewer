'use client';

import { Card, Row, Col, Statistic, Typography, Button, Space, Divider } from 'antd';
import { 
  BarChartOutlined, 
  DotChartOutlined, 
  FilterOutlined,
  DatabaseOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { getDatasetSummary } from '../services/dataParser';
const { Title, Paragraph, Text } = Typography;

type ViewType = 'dashboard' | 'scatterplot' | 'histogram' | 'filters';

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {  
  // Load dataset summary for overview stats
  const summary = getDatasetSummary();

  // Handle navigation to visualization pages
  const handleVisualizationClick = (key: string) => {
    const view = key as ViewType;
    onViewChange?.(view);
  };

  const overviewStats = [
    {
      title: 'Total Experiments',
      value: summary.totalExperiments,
      icon: <ExperimentOutlined className="text-blue-600" />,
    },
    {
      title: 'Input Properties',
      value: summary.inputProperties,
      icon: <DatabaseOutlined className="text-green-600" />,
    },
    {
      title: 'Output Properties', 
      value: summary.outputProperties,
      icon: <DatabaseOutlined className="text-orange-600" />,
    },
  ];

  const visualizationSections = [
    {
      key: 'scatterplot',
      title: 'Scatterplot Analysis',
      description: 'Explore relationships between variables with interactive scatter plots',
      icon: <DotChartOutlined className="text-2xl text-blue-500" />,
      color: 'border-gray-200',
      buttonColor: 'primary',
    },
    {
      key: 'histogram',
      title: 'Distribution Analysis',
      description: 'Visualize data distributions and frequency patterns',
      icon: <BarChartOutlined className="text-2xl text-green-500" />,
      color: 'border-gray-200',
      buttonColor: 'primary',
    },
    {
      key: 'filters',
      title: 'Data Filtering',
      description: 'Filter experiments by input properties and explore detailed results',
      icon: <FilterOutlined className="text-2xl text-purple-500" />,
      color: 'border-gray-200',
      buttonColor: 'primary',
    },
  ];

  return (
    <div className="w-full">
      <Space direction="vertical" size="large" className="w-full">
        {/* Dashboard Header */}
        <div>
          <Title level={2} className="mb-2">Dashboard</Title>
          <Paragraph className="text-gray-600 text-lg">
            Interactive data visualization and analysis for {summary.totalExperiments} experiments
          </Paragraph>
        </div>

        {/* Overview Statistics */}
        <Card title="Dataset Overview" className="shadow-sm">
          <Row gutter={[16, 16]}>
            {overviewStats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center border-0 bg-gray-50">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={{ color: '#3B4D8A' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Visualization Sections */}
        <Card title="Visualization Tools" className="shadow-sm">
          <Row gutter={[16, 16]}>
            {visualizationSections.map((section) => (
              <Col xs={24} lg={12} key={section.key}>
                <Card 
                  className={`h-full ${section.color} border-2 hover:shadow-md transition-shadow`}
                  styles={{ body: { padding: '20px' } }}
                >
                  <div className="flex items-start justify-between h-full">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        {section.icon}
                        <Title level={4} className="mb-0 ml-3">
                          {section.title}
                        </Title>
                      </div>
                      <Paragraph className="text-gray-600 mb-4">
                        {section.description}
                      </Paragraph>
                      <Button 
                        type={section.buttonColor === 'primary' ? 'primary' : 'default'}
                        size="large"
                        className="w-full"
                        onClick={() => handleVisualizationClick(section.key)}
                      >
                        Open {section.title}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Footer Info */}
        <div className="text-center py-4">
          <Divider />
          <Text className="text-gray-500">
            Interactive Data Viewer Dashboard • Ready for data exploration and analysis
          </Text>
        </div>
      </Space>
    </div>
  );
} 
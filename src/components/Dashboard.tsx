'use client';

import { Card, Row, Col, Statistic, Typography, Button, Space, Divider } from 'antd';
import { 
  BarChartOutlined, 
  DotChartOutlined, 
  HeatMapOutlined, 
  LineChartOutlined,
  FilterOutlined,
  SearchOutlined,
  DatabaseOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { getDatasetSummary } from '../services/dataParser';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedInputs, selectedOutputs } = useAppSelector(state => state.dataset);
  
  // Load dataset summary for overview stats
  const summary = getDatasetSummary();

  // Handle navigation to visualization pages
  const handleVisualizationClick = (key: string) => {
    switch (key) {
      case 'scatterplot':
        navigate('/scatterplot');
        break;
      case 'histogram':
        navigate('/histogram');
        break;
      default:
        console.log('Navigation not implemented for:', key);
    }
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
    {
      title: 'Selected Variables',
      value: selectedInputs.length + selectedOutputs.length,
      icon: <FilterOutlined className="text-purple-600" />,
    },
  ];

  const visualizationSections = [
    {
      key: 'scatterplot',
      title: 'Scatterplot Analysis',
      description: 'Explore relationships between variables with interactive scatter plots',
      icon: <DotChartOutlined className="text-2xl text-blue-500" />,
      color: 'border-blue-200 bg-blue-50',
      buttonColor: 'primary',
    },
    {
      key: 'histogram',
      title: 'Distribution Analysis',
      description: 'Visualize data distributions and frequency patterns',
      icon: <BarChartOutlined className="text-2xl text-green-500" />,
      color: 'border-green-200 bg-green-50',
      buttonColor: 'primary',
    },
    {
      key: 'correlation',
      title: 'Correlation Matrix',
      description: 'Discover correlations between multiple variables',
      icon: <HeatMapOutlined className="text-2xl text-red-500" />,
      color: 'border-red-200 bg-red-50',
      buttonColor: 'default',
    },
    {
      key: 'trends',
      title: 'Time Trends',
      description: 'Analyze temporal patterns and trends over time',
      icon: <LineChartOutlined className="text-2xl text-orange-500" />,
      color: 'border-orange-200 bg-orange-50',
      buttonColor: 'default',
    },
  ];

  const quickActions = [
    {
      key: 'filters',
      title: 'Data Filters',
      icon: <FilterOutlined />,
      description: 'Filter and subset your data',
    },
    {
      key: 'similarity',
      title: 'Similarity Search',
      icon: <SearchOutlined />,
      description: 'Find similar experiments',
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
                    valueStyle={{ color: '#1677ff' }}
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

        {/* Quick Actions */}
        <Card title="Quick Actions" className="shadow-sm">
          <Row gutter={[16, 16]}>
            {quickActions.map((action) => (
              <Col xs={24} sm={12} key={action.key}>
                <Card className="bg-gray-50 border-0 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="text-2xl text-gray-500 mr-4">
                      {action.icon}
                    </div>
                    <div>
                      <Text strong className="text-lg">{action.title}</Text>
                      <div className="text-gray-600">{action.description}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Current Selection Summary */}
        {(selectedInputs.length > 0 || selectedOutputs.length > 0) && (
          <Card title="Current Selection" className="shadow-sm border-blue-200">
            <Row gutter={[16, 8]}>
              {selectedInputs.length > 0 && (
                <Col xs={24} lg={12}>
                  <div>
                    <Text strong className="text-blue-600">Selected Inputs ({selectedInputs.length}):</Text>
                    <div className="mt-2">
                      {selectedInputs.map(input => (
                        <span 
                          key={input} 
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-1"
                        >
                          {input}
                        </span>
                      ))}
                    </div>
                  </div>
                </Col>
              )}
              {selectedOutputs.length > 0 && (
                <Col xs={24} lg={12}>
                  <div>
                    <Text strong className="text-green-600">Selected Outputs ({selectedOutputs.length}):</Text>
                    <div className="mt-2">
                      {selectedOutputs.map(output => (
                        <span 
                          key={output} 
                          className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2 mb-1"
                        >
                          {output}
                        </span>
                      ))}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        )}

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
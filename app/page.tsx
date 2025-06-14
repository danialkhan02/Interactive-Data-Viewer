'use client';

import { Button, Typography, Space, Card, Row, Col, Select, Tag } from 'antd';
import { useAppSelector, useAppDispatch } from '../src/store/hooks';
import { 
  setSelectedInputs, 
  setSelectedOutputs, 
  setCorrelationType, 
  setSimilarityCount 
} from '../src/store/datasetStore';
import { getInputProperties, getOutputProperties } from '../src/services/dataParser';
import MainLayout from '../src/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function Home() {
  const dispatch = useAppDispatch();
  const { 
    selectedInputs, 
    selectedOutputs, 
    correlationType, 
    similarityCount 
  } = useAppSelector(state => state.dataset);

  // Get available properties
  const inputProps = getInputProperties();
  const outputProps = getOutputProperties();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Title level={1} className="mb-2">Interactive Data Viewer</Title>
            <Paragraph className="text-lg text-gray-600">
              Uncountable Frontend Assignment - Next.js App with Ant Design components.
            </Paragraph>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Redux Store Test - Input Selection" size="small" className="h-full">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Select Input Properties:</Text>
                  <Select
                    mode="multiple"
                    placeholder="Select input properties"
                    value={selectedInputs}
                    onChange={(values) => dispatch(setSelectedInputs(values))}
                    style={{ width: '100%' }}
                  >
                    {inputProps.map(prop => (
                      <Option key={prop} value={prop}>{prop}</Option>
                    ))}
                  </Select>
                  <div>
                    <Text>Selected: </Text>
                    {selectedInputs.map(input => (
                      <Tag key={input} color="blue">{input}</Tag>
                    ))}
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Redux Store Test - Output Selection" size="small" className="h-full">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>Select Output Properties:</Text>
                  <Select
                    mode="multiple"
                    placeholder="Select output properties"
                    value={selectedOutputs}
                    onChange={(values) => dispatch(setSelectedOutputs(values))}
                    style={{ width: '100%' }}
                  >
                    {outputProps.map(prop => (
                      <Option key={prop} value={prop}>{prop}</Option>
                    ))}
                  </Select>
                  <div>
                    <Text>Selected: </Text>
                    {selectedOutputs.map(output => (
                      <Tag key={output} color="green">{output}</Tag>
                    ))}
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card title="Correlation Type" size="small">
                <Select
                  value={correlationType}
                  onChange={(value) => dispatch(setCorrelationType(value))}
                  style={{ width: '100%' }}
                >
                  <Option value="pearson">Pearson</Option>
                  <Option value="spearman">Spearman</Option>
                </Select>
              </Card>
            </Col>
            
            <Col xs={24} sm={12}>
              <Card title="Similarity Count" size="small">
                <Select
                  value={similarityCount}
                  onChange={(value) => dispatch(setSimilarityCount(value))}
                  style={{ width: '100%' }}
                >
                  {[3, 5, 10, 15, 20].map(count => (
                    <Option key={count} value={count}>{count}</Option>
                  ))}
                </Select>
              </Card>
            </Col>
          </Row>
          
          <div className="text-center">
            <Space size="middle" wrap>
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
          </div>
          
          <div className="text-center">
            <Paragraph className="text-gray-600">
              Redux store, Header, and Sidebar components are working correctly! Test the sidebar collapse/expand functionality and responsive design.
            </Paragraph>
          </div>
        </Space>
      </div>
    </MainLayout>
  );
}

'use client';

import { Button, Typography, Space, Card, Row, Col, Select, Tag, Layout } from 'antd';
import { useAppSelector, useAppDispatch } from '../src/store/hooks';
import { 
  setSelectedInputs, 
  setSelectedOutputs, 
  setCorrelationType, 
  setSimilarityCount 
} from '../src/store/datasetStore';
import { getInputProperties, getOutputProperties } from '../src/services/dataParser';
import Header from '../src/components/layout/Header';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

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
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-8">
        <div className="max-w-7xl mx-auto">
          <Space direction="vertical" align="center" size="large" className="w-full">
            <Title level={1}>Interactive Data Viewer</Title>
            <Paragraph className="text-center text-lg">
              Uncountable Frontend Assignment - Next.js App with Ant Design components.
            </Paragraph>
            
            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={12}>
                <Card title="Redux Store Test - Input Selection" size="small">
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
              
              <Col span={12}>
                <Card title="Redux Store Test - Output Selection" size="small">
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

            <Row gutter={16} style={{ width: '100%' }}>
              <Col span={12}>
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
              
              <Col span={12}>
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
              Redux store and Header component are working correctly! Use the navigation above to test responsiveness.
            </Paragraph>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}

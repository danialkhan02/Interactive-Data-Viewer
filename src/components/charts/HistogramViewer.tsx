'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Card, Typography, Select, Space, Divider, Row, Col, Alert } from 'antd';
import { useState } from 'react';
import { loadDataset, getInputProperties, getOutputProperties, getPropertyRange } from '../../services/dataParser';
import RangeSlider from '../ui/RangeSlider';

const { Title: AntTitle, Text } = Typography;
const { Option } = Select;

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramData {
  binLabel: string;
  count: number;
  binMin: number;
  binMax: number;
}

interface HistogramViewerProps {
  bins?: number;
  height?: number;
  className?: string;
  title?: string;
}

export default function HistogramViewer({
  bins = 20,
  height = 400,
  className,
  title,
}: HistogramViewerProps) {
  const [selectedOutput, setSelectedOutput] = useState<string>('');
  const [outputRange, setOutputRange] = useState<[number, number] | null>(null);

  // Get available properties
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();

  // Generate histogram data for a specific input property based on filtered experiments
  const generateInputHistogram = (inputProperty: string): HistogramData[] => {
    if (!selectedOutput || !outputRange) return [];

    const dataset = loadDataset();
    const filteredInputValues: number[] = [];

    // Collect input values from experiments whose output is in the target range
    Object.values(dataset).forEach(experiment => {
      const outputValue = experiment.outputs[selectedOutput];
      const inputValue = experiment.inputs[inputProperty];
      
      if (outputValue !== undefined && inputValue !== undefined) {
        // Check if output is within target range
        if (outputValue >= outputRange[0] && outputValue <= outputRange[1]) {
          filteredInputValues.push(inputValue);
        }
      }
    });

    if (filteredInputValues.length === 0) return [];

    // Get input property range
    const range = getPropertyRange(inputProperty, true);
    if (!range) return [];

    const { min, max } = range;
    const binWidth = (max - min) / bins;
    
    // Initialize bins
    const histogramBins: HistogramData[] = [];
    for (let i = 0; i < bins; i++) {
      const binMin = min + i * binWidth;
      const binMax = min + (i + 1) * binWidth;
      histogramBins.push({
        binLabel: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
        count: 0,
        binMin,
        binMax,
      });
    }

    // Count filtered input values in each bin
    filteredInputValues.forEach(value => {
      let binIndex = Math.floor((value - min) / binWidth);
      if (binIndex >= bins) binIndex = bins - 1;
      if (binIndex >= 0 && binIndex < bins) {
        histogramBins[binIndex].count++;
      }
    });

    return histogramBins;
  };

  // Get count of experiments that match the output criteria
  const getFilteredExperimentCount = (): number => {
    if (!selectedOutput || !outputRange) return 0;

    const dataset = loadDataset();
    let count = 0;

    Object.values(dataset).forEach(experiment => {
      const outputValue = experiment.outputs[selectedOutput];
      if (outputValue !== undefined && outputValue >= outputRange[0] && outputValue <= outputRange[1]) {
        count++;
      }
    });

    return count;
  };

  // Handle output selection change
  const handleOutputChange = (value: string) => {
    setSelectedOutput(value);
    setOutputRange(null); // Reset range when output changes
  };

  // Handle range change
  const handleRangeChange = (range: [number, number]) => {
    setOutputRange(range);
  };

  const filteredCount = getFilteredExperimentCount();

  // Step 1: Output Selection
  if (!selectedOutput) {
    return (
      <Card className={className}>
        <Space direction="vertical" className="w-full" align="center" size="large">
          <AntTitle level={3}>Reverse Analysis</AntTitle>
          <Text type="secondary" className="text-center text-lg">
            Discover which input formulations lead to your desired output results
          </Text>
          
          <div className="text-center max-w-2xl">
            <Alert
              message="How it works:"
              description="Select an output measurement (like Tensile Strength), set your target range, and see which input combinations typically produce those results."
              type="info"
              showIcon
              className="mb-6"
            />
          </div>

          <div className="text-center">
            <AntTitle level={4} className="mb-3">Step 1: Select Output Measurement</AntTitle>
            <Select
              placeholder="Choose an output measurement..."
              style={{ width: 300 }}
              size="large"
              showSearch
              optionFilterProp="children"
              onChange={handleOutputChange}
            >
              {outputProperties.map(prop => (
                <Option key={prop} value={prop}>
                  {prop}
                </Option>
              ))}
            </Select>
          </div>
        </Space>
      </Card>
    );
  }

  // Step 2: Range Selection
  if (!outputRange) {
    return (
      <Card className={className}>
        <Space direction="vertical" className="w-full" size="large">
          <div className="text-center">
            <AntTitle level={3}>Target Range for {selectedOutput}</AntTitle>
            <Text type="secondary" className="text-lg">
              Set the range of {selectedOutput} values you want to achieve
            </Text>
          </div>

          <div className="flex justify-between items-center">
            <Text strong>Selected Output:</Text>
            <Select
              value={selectedOutput}
              style={{ width: 200 }}
              onChange={handleOutputChange}
              size="small"
            >
              {outputProperties.map(prop => (
                <Option key={prop} value={prop}>
                  {prop}
                </Option>
              ))}
            </Select>
          </div>

          <Divider />

          <div className="max-w-4xl mx-auto">
            <AntTitle level={4} className="mb-4">Step 2: Set Target Range</AntTitle>
            <RangeSlider
              property={selectedOutput}
              onChange={handleRangeChange}
            />
          </div>

          <div className="text-center">
            <Text type="secondary">
              Move the sliders to define your target range for {selectedOutput}
            </Text>
          </div>
        </Space>
      </Card>
    );
  }

  // Step 3: Results Display
  if (filteredCount === 0) {
    return (
      <Card className={className}>
        <Space direction="vertical" className="w-full" align="center" size="large">
          <AntTitle level={4}>No experiments found in the specified range</AntTitle>
          <Text type="secondary">
            No experiments have {selectedOutput} values between {outputRange[0].toFixed(2)} and {outputRange[1].toFixed(2)}
          </Text>
          <Text type="secondary">
            Try adjusting your target range or selecting a different output measurement.
          </Text>
        </Space>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Space direction="vertical" className="w-full" size="large">
        {/* Header */}
        <div>
          <AntTitle level={3} className="mb-2">
            Successful Experiment Distribution
          </AntTitle>
          <Text className="text-lg">
            Input formulations that produced <strong>{selectedOutput}</strong> in your target range
          </Text>
          <br />
          <Text type="secondary">
            Found {filteredCount} successful experiments • Showing input distributions
          </Text>
        </div>

        {/* Configuration Panel */}
        <Card size="small" className="bg-gray-50">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <div>
                <Text strong className="block mb-2">Output Measurement:</Text>
                <Select
                  value={selectedOutput}
                  style={{ width: '100%' }}
                  onChange={handleOutputChange}
                >
                  {outputProperties.map(prop => (
                    <Option key={prop} value={prop}>
                      {prop}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={16}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text strong>Target Range:</Text>
                  <Text type="secondary" className="text-sm">
                    [{outputRange[0].toFixed(2)}, {outputRange[1].toFixed(2)}] • {filteredCount} experiments
                  </Text>
                </div>
                <RangeSlider
                  property={selectedOutput}
                  onChange={handleRangeChange}
                  value={outputRange}
                />
              </div>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* Input Histograms Grid */}
        <Row gutter={[16, 16]}>
          {inputProperties.map(inputProp => {
            const histogramData = generateInputHistogram(inputProp);
            
            if (histogramData.length === 0) {
              return (
                <Col xs={24} lg={12} key={inputProp}>
                  <Card size="small" className="h-full">
                    <div className="text-center py-8">
                      <Text type="secondary">No data for {inputProp}</Text>
                    </div>
                  </Card>
                </Col>
              );
            }

            const maxCount = Math.max(...histogramData.map(bin => bin.count));
            const totalInputCount = histogramData.reduce((sum, bin) => sum + bin.count, 0);

            const chartData = {
              labels: histogramData.map(bin => bin.binLabel),
              datasets: [
                {
                  label: `${inputProp} (${totalInputCount} experiments)`,
                  data: histogramData.map(bin => bin.count),
                  backgroundColor: 'rgba(34, 197, 94, 0.7)',
                  borderColor: 'rgba(34, 197, 94, 1)',
                  borderWidth: 1,
                },
              ],
            };

            const chartOptions: ChartOptions<'bar'> = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    title: (context) => {
                      const dataIndex = context[0].dataIndex;
                      const bin = histogramData[dataIndex];
                      return `${inputProp}: ${bin.binMin.toFixed(2)} - ${bin.binMax.toFixed(2)}`;
                    },
                    label: (context) => {
                      const count = context.parsed.y;
                      const percentage = totalInputCount > 0 ? ((count / totalInputCount) * 100).toFixed(1) : 0;
                      return [
                        `Count: ${count} experiments`,
                        `Percentage: ${percentage}% of successful experiments`,
                      ];
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: inputProp,
                    font: { size: 12, weight: 'bold' },
                  },
                  ticks: {
                    maxRotation: 45,
                    font: { size: 10 },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Frequency',
                    font: { size: 12, weight: 'bold' },
                  },
                  beginAtZero: true,
                  ticks: {
                    stepSize: Math.max(1, Math.ceil(maxCount / 10)),
                  },
                },
              },
            };

            return (
              <Col xs={24} lg={12} key={inputProp}>
                <Card size="small" className="h-full">
                  <div className="mb-2">
                    <Text strong className="text-sm">{inputProp}</Text>
                  </div>
                  <div style={{ width: '100%', height: height / 2.5 }}>
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  <div className="mt-2 text-center text-xs text-gray-500">
                    {totalInputCount} experiments • Max: {maxCount} per bin
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Divider />

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <AntTitle level={5} className="mb-2">💡 Insights</AntTitle>
          <Text type="secondary">
            These histograms show the distribution of successful experiments that achieved your target {selectedOutput} range.
          </Text>
        </div>
      </Space>
    </Card>
  );
} 
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
import { Card, Typography, Select, Space } from 'antd';
import { useState } from 'react';
import { loadDataset, getInputProperties, getOutputProperties, getPropertyRange } from '../../services/dataParser';

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
  property?: string;
  bins?: number;
  height?: number;
  className?: string;
  title?: string;
}

export default function HistogramViewer({
  property: propProperty,
  bins = 20,
  height = 400,
  className,
  title,
}: HistogramViewerProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>(propProperty || '');

  // Get available properties
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();

  const currentProperty = propProperty || selectedProperty;

  // Generate histogram data
  const generateHistogramData = (property: string): HistogramData[] => {
    if (!property) return [];

    const dataset = loadDataset();
    const isInput = inputProperties.includes(property);
    const values: number[] = [];

    // Collect all values for the property
    Object.values(dataset).forEach(experiment => {
      const propertyValue = isInput ? experiment.inputs[property] : experiment.outputs[property];
      if (propertyValue !== undefined) {
        values.push(propertyValue);
      }
    });

    if (values.length === 0) return [];

    // Get property range
    const range = getPropertyRange(property, isInput);
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

    // Count values in each bin
    values.forEach(value => {
      // Find which bin this value belongs to
      let binIndex = Math.floor((value - min) / binWidth);
      
      // Handle edge case where value equals max
      if (binIndex >= bins) {
        binIndex = bins - 1;
      }
      
      if (binIndex >= 0 && binIndex < bins) {
        histogramBins[binIndex].count++;
      }
    });

    return histogramBins;
  };

  const histogramData = generateHistogramData(currentProperty);
  const totalCount = histogramData.reduce((sum, bin) => sum + bin.count, 0);

  // Prepare Chart.js data
  const chartData = {
    labels: histogramData.map(bin => bin.binLabel),
    datasets: [
      {
        label: `Frequency (${totalCount} experiments)`,
        data: histogramData.map(bin => bin.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex;
            const bin = histogramData[dataIndex];
            return `Range: ${bin.binMin.toFixed(2)} - ${bin.binMax.toFixed(2)}`;
          },
          label: (context) => {
            const count = context.parsed.y;
            const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : 0;
            return [
              `Count: ${count} experiments`,
              `Percentage: ${percentage}%`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: currentProperty || 'Property Value',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency (Number of Experiments)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const handlePropertyChange = (value: string) => {
    setSelectedProperty(value);
  };

  // Show property selection if no property provided
  if (!propProperty && !selectedProperty) {
    return (
      <Card className={className}>
        <Space direction="vertical" className="w-full" align="center">
          <AntTitle level={4}>Select Property for Histogram</AntTitle>
          <Text type="secondary" className="text-center">
            Choose a property to view its frequency distribution
          </Text>
          <Select
            placeholder="Select property..."
            style={{ width: 300 }}
            showSearch
            optionFilterProp="children"
            onChange={handlePropertyChange}
          >
            <Select.OptGroup label="Input Properties">
              {inputProperties.map(prop => (
                <Option key={`input-${prop}`} value={prop}>
                  {prop}
                </Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label="Output Properties">
              {outputProperties.map(prop => (
                <Option key={`output-${prop}`} value={prop}>
                  {prop}
                </Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Space>
      </Card>
    );
  }

  if (!currentProperty) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <Text type="secondary">No property selected for histogram</Text>
        </div>
      </Card>
    );
  }

  if (histogramData.length === 0) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <Text type="secondary">
            No data available for property: {currentProperty}
          </Text>
        </div>
      </Card>
    );
  }

  // Calculate statistics
  const maxCount = Math.max(...histogramData.map(bin => bin.count));
  const avgCount = totalCount / bins;

  return (
    <Card className={className}>
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <AntTitle level={4} className="mb-2">
              {title || `${currentProperty} Distribution`}
            </AntTitle>
            <Text type="secondary">
              Showing frequency distribution across {bins} bins • {totalCount} total experiments
            </Text>
          </div>
          
          {!propProperty && (
            <Select
              value={selectedProperty}
              style={{ width: 200 }}
              onChange={handlePropertyChange}
              size="small"
            >
              <Select.OptGroup label="Input Properties">
                {inputProperties.map(prop => (
                  <Option key={`input-${prop}`} value={prop}>
                    {prop}
                  </Option>
                ))}
              </Select.OptGroup>
              <Select.OptGroup label="Output Properties">
                {outputProperties.map(prop => (
                  <Option key={`output-${prop}`} value={prop}>
                    {prop}
                  </Option>
                ))}
              </Select.OptGroup>
            </Select>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: height }}>
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Max frequency: {maxCount} experiments</span>
        <span>Average per bin: {avgCount.toFixed(1)} experiments</span>
      </div>
    </Card>
  );
} 
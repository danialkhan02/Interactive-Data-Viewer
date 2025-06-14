'use client';

import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Card, Typography, Button, Space } from 'antd';
import { ZoomInOutlined, UndoOutlined } from '@ant-design/icons';
import { ChartDataPoint } from '../../types';
import { loadDataset } from '../../services/dataParser';
import { useAppSelector } from '../../store/hooks';
import { useRef } from 'react';

const { Title, Text } = Typography;

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin);

interface ScatterPlotProps {
  height?: number;
  className?: string;
  title?: string;
}

export default function ScatterPlot({
  height = 400,
  className,
  title,
}: ScatterPlotProps) {
  // Chart reference for zoom controls
  const chartRef = useRef<ChartJS<'scatter'>>(null);
  
  // Get selected properties from Redux store
  const { selectedInputs, selectedOutputs } = useAppSelector(state => state.dataset);
  
  // Determine which properties to use for X and Y axes
  const xProperty = selectedInputs[0];
  const yProperty = selectedOutputs[0];

  // Show message if no properties are selected
  if (!xProperty || !yProperty) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <Title level={4} type="secondary">
            Select Properties to View Scatterplot
          </Title>
          <Text type="secondary">
            Please select at least one input property (X-axis) and one output property (Y-axis) to display the scatterplot.
          </Text>
        </div>
      </Card>
    );
  }

  // Generate sample data from the dataset
  const generateScatterData = (): ChartDataPoint[] => {
    const dataset = loadDataset();
    const dataPoints: ChartDataPoint[] = [];

    Object.entries(dataset).forEach(([experimentId, experiment]) => {
      // Get x value (check inputs first, then outputs)
      const xValue = experiment.inputs[xProperty] ?? experiment.outputs[xProperty];
      // Get y value (check inputs first, then outputs)  
      const yValue = experiment.inputs[yProperty] ?? experiment.outputs[yProperty];

      // Only add point if both values exist
      if (xValue !== undefined && yValue !== undefined) {
        dataPoints.push({
          x: xValue,
          y: yValue,
          experimentId,
        });
      }
    });

    return dataPoints;
  };

  const scatterData = generateScatterData();

  // Prepare Chart.js data
  const chartData = {
    datasets: [
      {
        label: `Experiments (${scatterData.length} points)`,
        data: scatterData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const point = context[0];
            const dataPoint = scatterData[point.dataIndex];
            return `Experiment: ${dataPoint.experimentId}`;
          },
          label: (context) => {
            return [
              `${xProperty}: ${context.parsed.x.toFixed(2)}`,
              `${yProperty}: ${context.parsed.y.toFixed(2)}`,
            ];
          },
          afterBody: () => {
            return ['', 'Click and drag to pan', 'Use mouse wheel to zoom'];
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: xProperty,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: yProperty,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  if (scatterData.length === 0) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <Text type="secondary">
            No data available for {xProperty} vs {yProperty}
          </Text>
        </div>
      </Card>
    );
  }

  // Zoom control functions
  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const zoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.1);
    }
  };

  const zoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.9);
    }
  };

  return (
    <Card className={className}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <Title level={4} className="mb-2">
            {title || `${xProperty} vs ${yProperty}`}
          </Title>
          <Text type="secondary">
            Showing {scatterData.length} experiments • Mouse wheel to zoom • Ctrl+drag to pan
          </Text>
        </div>
        
        <Space>
          <Button 
            icon={<ZoomInOutlined />} 
            onClick={zoomIn}
            size="small"
            title="Zoom In"
          />
          <Button 
            icon={<ZoomInOutlined style={{ transform: 'scaleY(-1)' }} />} 
            onClick={zoomOut}
            size="small"
            title="Zoom Out"
          />
          <Button 
            icon={<UndoOutlined />} 
            onClick={resetZoom}
            size="small"
            title="Reset Zoom"
          >
            Reset
          </Button>
        </Space>
      </div>

      <div style={{ width: '100%', height: height }}>
        <Scatter ref={chartRef} data={chartData} options={options} />
      </div>
      
      <div className="mt-2 text-center">
        <Text type="secondary" className="text-xs">
          Tip: Hover over points for details • Use controls above or mouse interactions for zoom/pan
        </Text>
      </div>
    </Card>
  );
} 
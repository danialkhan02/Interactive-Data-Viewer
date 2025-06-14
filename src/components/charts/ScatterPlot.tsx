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
import { Card, Typography } from 'antd';
import { ChartDataPoint } from '../../types';
import { loadDataset } from '../../services/dataParser';

const { Title, Text } = Typography;

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ScatterPlotProps {
  xProperty?: string;
  yProperty?: string;
  height?: number;
  className?: string;
  title?: string;
}

export default function ScatterPlot({
  xProperty = 'Oven Temperature',
  yProperty = 'Viscosity',
  height = 400,
  className,
  title,
}: ScatterPlotProps) {
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
        label: 'Experiments',
        data: scatterData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
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
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const point = context[0];
            const dataPoint = scatterData[point.dataIndex];
            return `Experiment: ${dataPoint.experimentId}`;
          },
          label: (context) => {
            return [
              `${xProperty}: ${context.parsed.x}`,
              `${yProperty}: ${context.parsed.y}`,
            ];
          },
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
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: yProperty,
        },
      },
    },
    interaction: {
      intersect: false,
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

  return (
    <Card className={className}>
      {title && (
        <Title level={4} className="mb-4">
          {title}
        </Title>
      )}
      
      <div className="mb-4">
        <Text type="secondary">
          Showing {scatterData.length} experiments: {xProperty} vs {yProperty}
        </Text>
      </div>

      <div style={{ width: '100%', height: height }}>
        <Scatter data={chartData} options={options} />
      </div>
    </Card>
  );
} 
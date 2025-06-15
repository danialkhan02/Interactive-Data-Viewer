'use client';

import { Table, Typography, Space, Tag, Button, Tooltip, Card, Statistic, Row, Col } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { EyeOutlined, ExperimentOutlined, FilterOutlined } from '@ant-design/icons';
import { Dataset, ExperimentData } from '../../types';
import { filterExperiments, getInputProperties, getOutputProperties } from '../../services/dataParser';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

export interface FilteredResultsTableProps {
  filters?: Record<string, [number, number]>;
  onExperimentSelect?: (experimentId: string, data: ExperimentData) => void;
  className?: string;
  title?: string;
  showSummary?: boolean;
  maxHeight?: number;
  pageSize?: number;
}

interface TableDataRow extends Record<string, unknown> {
  key: string;
  experimentId: string;
  data: ExperimentData;
}

export default function FilteredResultsTable({
  filters = {},
  onExperimentSelect,
  className,
  title = "Filtered Experiments",
  showSummary = true,
  maxHeight = 600,
  pageSize = 50,
}: FilteredResultsTableProps) {
  const [loading, setLoading] = useState(false);
  const [filteredDataset, setFilteredDataset] = useState<Dataset>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // Get property lists for columns
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();

  // Apply filters and update dataset
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        const filtered = filterExperiments(filters);
        setFilteredDataset(filtered);
      } catch (error) {
        console.error('Error applying filters:', error);
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filters]);

  // Prepare table data
  const tableData: TableDataRow[] = useMemo(() => {
    return Object.entries(filteredDataset).map(([experimentId, data]) => {
      const row: TableDataRow = {
        key: experimentId,
        experimentId,
        data,
      };

      // Add input values as individual columns
      inputProperties.forEach(prop => {
        row[`input_${prop}`] = data.inputs[prop];
      });

      // Add output values as individual columns
      outputProperties.forEach(prop => {
        row[`output_${prop}`] = data.outputs[prop];
      });

      return row;
    });
  }, [filteredDataset, inputProperties, outputProperties]);

  // Create table columns
  const columns: ColumnsType<TableDataRow> = useMemo(() => {
    const cols: ColumnsType<TableDataRow> = [
      {
        title: 'Experiment ID',
        dataIndex: 'experimentId',
        key: 'experimentId',
        fixed: 'left',
        width: 160,
        render: (id: string) => (
          <Space>
            <ExperimentOutlined className="text-blue-500" />
            <Text strong className="font-mono text-sm">
              {id}
            </Text>
          </Space>
        ),
        sorter: (a, b) => a.experimentId.localeCompare(b.experimentId),
      },
    ];

    // Add input property columns
    if (inputProperties.length > 0) {
      cols.push({
        title: 'Input Properties',
        children: inputProperties.map(prop => ({
          title: (
            <Tooltip title={`Input: ${prop}`}>
              <Text className="text-xs font-medium">{prop}</Text>
            </Tooltip>
          ),
          dataIndex: `input_${prop}`,
          key: `input_${prop}`,
          width: 100,
          align: 'center' as const,
          render: (value: number) => (
            <Text className="font-mono text-xs">
              {value?.toFixed(2) ?? 'N/A'}
            </Text>
          ),
          sorter: (a, b) => {
            const aVal = a[`input_${prop}`] as number ?? 0;
            const bVal = b[`input_${prop}`] as number ?? 0;
            return aVal - bVal;
          },
        })),
      });
    }

    // Add output property columns
    if (outputProperties.length > 0) {
      cols.push({
        title: 'Output Properties',
        children: outputProperties.map(prop => ({
          title: (
            <Tooltip title={`Output: ${prop}`}>
              <Text className="text-xs font-medium text-green-600">{prop}</Text>
            </Tooltip>
          ),
          dataIndex: `output_${prop}`,
          key: `output_${prop}`,
          width: 100,
          align: 'center' as const,
          render: (value: number) => (
            <Tag color="green" className="font-mono text-xs">
              {value?.toFixed(2) ?? 'N/A'}
            </Tag>
          ),
          sorter: (a, b) => {
            const aVal = a[`output_${prop}`] as number ?? 0;
            const bVal = b[`output_${prop}`] as number ?? 0;
            return aVal - bVal;
          },
        })),
      });
    }

    // Add actions column
    cols.push({
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onExperimentSelect?.(record.experimentId, record.data)}
          >
            View
          </Button>
        </Space>
      ),
    });

    return cols;
  }, [inputProperties, outputProperties, onExperimentSelect]);

  // Expanded row render function
  const expandedRowRender = (record: TableDataRow) => {
    const { data } = record;
    
    return (
      <div className="bg-gray-50 p-4 rounded">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title="Input Details" className="h-full">
              <Space direction="vertical" size="small" className="w-full">
                {Object.entries(data.inputs).map(([prop, value]) => (
                  <div key={prop} className="flex justify-between items-center">
                    <Text className="text-sm">{prop}:</Text>
                    <Text strong className="font-mono text-sm">{value.toFixed(3)}</Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Output Results" className="h-full">
              <Space direction="vertical" size="small" className="w-full">
                {Object.entries(data.outputs).map(([prop, value]) => (
                  <div key={prop} className="flex justify-between items-center">
                    <Text className="text-sm text-green-600">{prop}:</Text>
                    <Tag color="green" className="font-mono">{value.toFixed(3)}</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const handleExpand = (expanded: boolean, record: TableDataRow) => {
    const key = record.key;
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, key]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(k => k !== key));
    }
  };

  const activeFilterCount = Object.keys(filters).length;
  const totalExperiments = tableData.length;

  return (
    <Card className={className}>
      <Space direction="vertical" className="w-full" size="large">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Title level={4} className="mb-2">{title}</Title>
            <Text type="secondary">
              {loading ? 'Applying filters...' : `Showing ${totalExperiments} experiments`}
              {activeFilterCount > 0 && ` with ${activeFilterCount} active filters`}
            </Text>
          </div>

          {onExperimentSelect && (
            <Tooltip title="Click 'View' button on any row to select an experiment">
              <Button type="dashed" size="small" icon={<EyeOutlined />}>
                Select Mode
              </Button>
            </Tooltip>
          )}
        </div>

        {/* Summary Statistics */}
        {showSummary && totalExperiments > 0 && (
          <Row gutter={[16, 16]}>
            <Col xs={8} sm={6}>
              <Statistic
                title="Total Experiments"
                value={totalExperiments}
                prefix={<ExperimentOutlined />}
              />
            </Col>
            <Col xs={8} sm={6}>
              <Statistic
                title="Active Filters"
                value={activeFilterCount}
                prefix={<FilterOutlined />}
              />
            </Col>
            <Col xs={8} sm={6}>
              <Statistic
                title="Input Properties"
                value={inputProperties.length}
              />
            </Col>
            <Col xs={8} sm={6}>
              <Statistic
                title="Output Properties"
                value={outputProperties.length}
              />
            </Col>
          </Row>
        )}

        {/* Results Table */}
        <Table<TableDataRow>
          dataSource={tableData}
          columns={columns}
          loading={loading}
          scroll={{ 
            x: Math.max(800, (inputProperties.length + outputProperties.length) * 100 + 260),
            y: maxHeight 
          }}
          pagination={{
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} experiments`,
          }}
          size="small"
          expandable={{
            expandedRowRender,
            onExpand: handleExpand,
            expandedRowKeys,
            expandRowByClick: false,
          }}
          rowClassName={(record, idx) => 
            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }
          bordered
        />

        {/* Empty State */}
        {!loading && totalExperiments === 0 && (
          <div className="text-center py-12">
            <ExperimentOutlined className="text-4xl text-gray-400 mb-4" />
            <Title level={4} type="secondary">No experiments match the current filters</Title>
            <Text type="secondary">
              Try adjusting your filter criteria or clearing some filters to see more results.
            </Text>
          </div>
        )}

        {/* Footer Info */}
        {totalExperiments > 0 && (
          <div className="bg-blue-50 p-3 rounded text-center">
            <Text type="secondary" className="text-xs">
              💡 Click on experiment rows to expand detailed view • Use column headers to sort data • 
              {onExperimentSelect && " Click 'View' to select an experiment for detailed analysis"}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
} 
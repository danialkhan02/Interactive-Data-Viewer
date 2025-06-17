'use client';

import { Table, Typography, Space, Tag, Tooltip, Card, Statistic, Row, Col, Button } from 'antd';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ExperimentOutlined, FilterOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
  isEmpty?: boolean;
}

export default function FilteredResultsTable({
  filters = {},
  onExperimentSelect: _onExperimentSelect, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  title = "Filtered Experiments",
  showSummary = true,
  maxHeight = 600,
  pageSize = 20,
}: FilteredResultsTableProps) {
  const [loading, setLoading] = useState(false);
  const [filteredDataset, setFilteredDataset] = useState<Dataset>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

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

  // Prepare table data with consistent page sizing
  const tableData: TableDataRow[] = useMemo(() => {
    const actualData = Object.entries(filteredDataset).map(([experimentId, data]) => {
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

    // Calculate total pages needed
    const totalPages = Math.max(1, Math.ceil(actualData.length / pageSize));
    const totalRowsNeeded = totalPages * pageSize;
    
    // Pad with empty rows to maintain consistent page size
    const paddedData = [...actualData];
    for (let i = actualData.length; i < totalRowsNeeded; i++) {
      const emptyRow: TableDataRow = {
        key: `empty_${i}`,
        experimentId: '',
        data: { inputs: {}, outputs: {} } as ExperimentData,
        isEmpty: true,
      };

      // Add empty values for input columns
      inputProperties.forEach(prop => {
        emptyRow[`input_${prop}`] = undefined;
      });

      // Add empty values for output columns
      outputProperties.forEach(prop => {
        emptyRow[`output_${prop}`] = undefined;
      });

      paddedData.push(emptyRow);
    }

    return paddedData;
  }, [filteredDataset, inputProperties, outputProperties, pageSize]);

  // Render functions to prevent recreation on every render
  const renderExperimentId = useCallback((id: string, record: TableDataRow) => {
    if (record.isEmpty) {
      return <div style={{ height: '24px' }} />;
    }
    return (
      <Space>
        <ExperimentOutlined className="text-blue-500" />
        <Text strong className="font-mono text-sm">
          {id}
        </Text>
      </Space>
    );
  }, []);

  const renderInputValue = useCallback((value: number, record: TableDataRow) => {
    if (record.isEmpty) {
      return <div style={{ height: '20px' }} />;
    }
    return (
      <Text className="font-mono text-xs">
        {value?.toFixed(2) ?? 'N/A'}
      </Text>
    );
  }, []);

  const renderOutputValue = useCallback((value: number, record: TableDataRow) => {
    if (record.isEmpty) {
      return <div style={{ height: '20px' }} />;
    }
    return (
      <Tag color="green" className="font-mono text-xs">
        {value?.toFixed(2) ?? 'N/A'}
      </Tag>
    );
  }, []);

  const sorterFunction = useCallback((a: TableDataRow, b: TableDataRow) => {
    if (a.isEmpty && b.isEmpty) return 0;
    if (a.isEmpty) return 1;
    if (b.isEmpty) return -1;
    return a.experimentId.localeCompare(b.experimentId);
  }, []);

  // Create table columns
  const columns: ColumnsType<TableDataRow> = useMemo(() => {
    const cols: ColumnsType<TableDataRow> = [
      {
        title: 'Experiment ID',
        dataIndex: 'experimentId',
        key: 'experimentId',
        fixed: 'left',
        width: 160,
        render: renderExperimentId,
        sorter: sorterFunction,
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
          render: renderInputValue,
          sorter: (a, b) => {
            if (a.isEmpty && b.isEmpty) return 0;
            if (a.isEmpty) return 1;
            if (b.isEmpty) return -1;
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
          render: renderOutputValue,
          sorter: (a, b) => {
            if (a.isEmpty && b.isEmpty) return 0;
            if (a.isEmpty) return 1;
            if (b.isEmpty) return -1;
            const aVal = a[`output_${prop}`] as number ?? 0;
            const bVal = b[`output_${prop}`] as number ?? 0;
            return aVal - bVal;
          },
        })),
      });
    }

    return cols;
  }, [inputProperties, outputProperties, renderExperimentId, renderInputValue, renderOutputValue, sorterFunction]);

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
  const totalExperiments = Object.keys(filteredDataset).length;

  // Scroll navigation functions
  const scrollToInputs = () => {
    const tableElement = tableRef.current?.querySelector('.ant-table-body');
    if (tableElement) {
      tableElement.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scrollToOutputs = () => {
    const tableElement = tableRef.current?.querySelector('.ant-table-body');
    if (tableElement) {
      // Calculate scroll position: Experiment ID column (160px) + all input columns (100px each)
      const scrollLeft = 160 + (inputProperties.length * 100);
      tableElement.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

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

          {/* Navigation Buttons */}
          {totalExperiments > 0 && (inputProperties.length > 0 || outputProperties.length > 0) && (
            <Space>
              {inputProperties.length > 0 && (
                <Button
                  size="small"
                  icon={<ArrowLeftOutlined />}
                  onClick={scrollToInputs}
                  title="Scroll to Input Properties"
                >
                  Inputs
                </Button>
              )}
              {outputProperties.length > 0 && (
                <Button
                  size="small"
                  icon={<ArrowRightOutlined />}
                  onClick={scrollToOutputs}
                  title="Scroll to Output Properties"
                  type="primary"
                >
                  Outputs
                </Button>
              )}
            </Space>
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
        <div ref={tableRef}>
          <Table<TableDataRow>
            dataSource={tableData}
            columns={columns}
            loading={loading}
            scroll={{ 
              x: Math.max(800, (inputProperties.length + outputProperties.length) * 100 + 260),
              y: maxHeight 
            }}
            size="small"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => {
                const actualTotal = Object.keys(filteredDataset).length;
                return `${range[0]}-${Math.min(range[1], actualTotal)} of ${actualTotal} experiments`;
              },
            }}
            expandable={{
              expandedRowRender,
              onExpand: handleExpand,
              expandedRowKeys,
              expandRowByClick: false,
              rowExpandable: (record) => !record.isEmpty,
            }}
            rowClassName={(record, idx) => {
              if (record.isEmpty) {
                return 'opacity-0 pointer-events-none';
              }
              return idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            }}
            bordered
          />
        </div>

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
              💡 Click on experiment rows to expand detailed view • Use column headers to sort data • Use navigation buttons above to jump between sections
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
} 
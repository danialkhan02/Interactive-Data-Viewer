'use client';

import { Space, Typography, Drawer, Button, Badge } from 'antd';
import { useState } from 'react';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';
import FilterPanel from '../components/ui/FilterPanel';
import FilteredResultsTable from '../components/ui/FilteredResultsTable';
import { ExperimentData } from '../types';

const { Title, Paragraph } = Typography;

export default function FilterPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, [number, number]>>({});
  const [selectedExperiment, setSelectedExperiment] = useState<{
    id: string;
    data: ExperimentData;
  } | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleFiltersChange = (filters: Record<string, [number, number]>) => {
    setActiveFilters(filters);
  };

  const handleExperimentSelect = (experimentId: string, data: ExperimentData) => {
    setSelectedExperiment({ id: experimentId, data });
    console.log('Selected experiment:', experimentId, data);
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="w-full h-full">
      <Space direction="vertical" size="large" className="w-full">
        {/* Compact Header with Filter Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="mb-1">Data Filtering</Title>
            <Paragraph className="text-gray-600 mb-0">
              Filter and explore experiments • {activeFilterCount} active filters
            </Paragraph>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedExperiment && (
              <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                <strong>Selected:</strong> {selectedExperiment.id}
              </div>
            )}
            
            <Badge count={activeFilterCount} showZero={false}>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
                size="large"
              >
                Filters
              </Button>
            </Badge>
          </div>
        </div>

        {/* Full Width Results Table */}
        <FilteredResultsTable
          filters={activeFilters}
          onExperimentSelect={handleExperimentSelect}
          title=""
          showSummary={false}
          maxHeight={window.innerHeight - 200}
          pageSize={8}
          className="w-full"
        />
      </Space>

      {/* Filter Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>Filter Controls</span>
          </div>
        }
        placement="left"
        width={600}
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        styles={{
          body: { padding: '16px' }
        }}
      >
        <FilterPanel 
          onFiltersChange={handleFiltersChange}
          title=""
          defaultCollapsed={false}
          className="border-0 shadow-none"
        />
      </Drawer>
    </div>
  );
} 
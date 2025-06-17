'use client';

import { Card, Typography, Space, Checkbox, Collapse, Button, Badge } from 'antd';
import { useState, useEffect } from 'react';
import { FilterOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';
import { getInputProperties, getPropertyRange } from '../../services/dataParser';
import RangeSlider from './RangeSlider';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export interface PropertyFilter {
  property: string;
  enabled: boolean;
  range: [number, number];
  originalRange: [number, number];
}

export interface FilterPanelProps {
  onFiltersChange?: (filters: Record<string, [number, number]>) => void;
  className?: string;
  title?: string;
  defaultCollapsed?: boolean;
  showApplyButton?: boolean;
}

export default function FilterPanel({
  onFiltersChange,
  className,
  title = "Data Filters",
  defaultCollapsed = false,
  showApplyButton = false,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<Record<string, PropertyFilter>>({});
  const [loading, setLoading] = useState(true);

  // Initialize filters for all input properties
  useEffect(() => {
    const initializeFilters = async () => {
      setLoading(true);
      
      try {
        const inputProperties = getInputProperties();
        const initialFilters: Record<string, PropertyFilter> = {};

        inputProperties.forEach(property => {
          const range = getPropertyRange(property, true);
          if (range) {
            initialFilters[property] = {
              property,
              enabled: false,
              range: [range.min, range.max],
              originalRange: [range.min, range.max],
            };
          }
        });

        setFilters(initialFilters);
      } catch (error) {
        console.error('Error initializing filters:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeFilters();
  }, []);

  // Notify parent of active filters
  const notifyFiltersChange = (updatedFilters: Record<string, PropertyFilter>) => {
    if (onFiltersChange) {
      const activeFilters: Record<string, [number, number]> = {};
      
      Object.entries(updatedFilters).forEach(([property, filter]) => {
        if (filter.enabled) {
          activeFilters[property] = filter.range;
        }
      });

      onFiltersChange(activeFilters);
    }
  };

  // Handle enabling/disabling a filter
  const handleFilterToggle = (property: string, enabled: boolean) => {
    const updatedFilters = {
      ...filters,
      [property]: {
        ...filters[property],
        enabled,
      },
    };
    
    setFilters(updatedFilters);
    notifyFiltersChange(updatedFilters);
  };

  // Handle range change for a property
  const handleRangeChange = (property: string, range: [number, number]) => {
    const updatedFilters = {
      ...filters,
      [property]: {
        ...filters[property],
        range,
      },
    };
    
    setFilters(updatedFilters);
    
    // Only notify if the filter is enabled
    if (filters[property].enabled) {
      notifyFiltersChange(updatedFilters);
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, property) => {
      acc[property] = {
        ...filters[property],
        enabled: false,
      };
      return acc;
    }, {} as Record<string, PropertyFilter>);
    
    setFilters(clearedFilters);
    notifyFiltersChange(clearedFilters);
  };

  // Reset all ranges to original values
  const handleResetRanges = () => {
    const resetFilters = Object.keys(filters).reduce((acc, property) => {
      acc[property] = {
        ...filters[property],
        range: [...filters[property].originalRange] as [number, number],
      };
      return acc;
    }, {} as Record<string, PropertyFilter>);
    
    setFilters(resetFilters);
    notifyFiltersChange(resetFilters);
  };

  // Apply all enabled filters (for cases where immediate application isn't desired)
  const handleApplyFilters = () => {
    notifyFiltersChange(filters);
  };

  // Get count of active filters
  const activeFilterCount = Object.values(filters).filter(f => f.enabled).length;
  const totalFilterCount = Object.keys(filters).length;

  if (loading) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <Text type="secondary">Loading filter properties...</Text>
        </div>
      </Card>
    );
  }

  const filterEntries = Object.entries(filters);

  return (
    <Card className={className}>
      <Space direction="vertical" className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FilterOutlined />
            <Title level={4} className="mb-0">{title}</Title>
            <Badge 
              count={activeFilterCount} 
              showZero={false}
              style={{ backgroundColor: '#52c41a' }}
            />
          </div>
          
          <Space size="small">
            {showApplyButton && (
              <Button 
                type="primary" 
                size="small"
                onClick={handleApplyFilters}
                disabled={activeFilterCount === 0}
              >
                Apply Filters
              </Button>
            )}
            <Button 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={handleResetRanges}
              title="Reset all ranges"
            />
            <Button 
              size="small" 
              icon={<ClearOutlined />}
              onClick={handleClearAll}
              disabled={activeFilterCount === 0}
              title="Clear all filters"
            />
          </Space>
        </div>

        {/* Filter Summary */}
        <div className="bg-gray-50 p-3 rounded">
          <Text type="secondary" className="text-sm">
            {activeFilterCount} of {totalFilterCount} input properties filtered
            {activeFilterCount > 0 && " • Filters applied to dataset"}
          </Text>
        </div>

        {/* Filter Controls */}
        <Collapse 
          defaultActiveKey={defaultCollapsed ? [] : ['filters']}
          ghost
        >
          <Panel 
            header={
              <Text strong>
                Input Property Filters ({activeFilterCount} active)
              </Text>
            } 
            key="filters"
          >
            <Space direction="vertical" className="w-full" size="middle">
              {filterEntries.length === 0 ? (
                <Text type="secondary">No input properties available for filtering</Text>
              ) : (
                filterEntries.map(([property, filter]) => (
                  <Card key={property} size="small" className={filter.enabled ? 'border-blue-300' : ''}>
                    <Space direction="vertical" className="w-full" size="small">
                      {/* Property Header */}
                      <div className="flex justify-between items-center">
                        <Checkbox
                          checked={filter.enabled}
                          onChange={(e) => handleFilterToggle(property, e.target.checked)}
                        >
                          <Text strong className={filter.enabled ? 'text-blue-600' : ''}>
                            {property}
                          </Text>
                        </Checkbox>
                        
                        {filter.enabled && (
                          <Text type="secondary" className="text-xs">
                            [{filter.range[0].toFixed(2)}, {filter.range[1].toFixed(2)}]
                          </Text>
                        )}
                      </div>

                      {/* Range Slider */}
                      <div className={filter.enabled ? '' : 'opacity-50'}>
                        <RangeSlider
                          property={property}
                          value={filter.range}
                          onChange={(range) => handleRangeChange(property, range)}
                          disabled={!filter.enabled}
                          showInputs={filter.enabled}
                        />
                      </div>
                    </Space>
                  </Card>
                ))
              )}
            </Space>
          </Panel>
        </Collapse>

        {/* Footer Info */}
        {activeFilterCount > 0 && (
          <div className="bg-blue-50 p-3 rounded">
            <Text type="secondary" className="text-xs">
                          💡 Active filters will be applied to all visualizations and analyses. 
            Use &quot;Clear All&quot; to remove all filters or uncheck individual properties.
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
} 
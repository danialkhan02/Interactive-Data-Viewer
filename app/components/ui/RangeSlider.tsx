'use client';

import { Slider, Typography, Space, InputNumber, Row, Col } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { getPropertyRange, getInputProperties, getOutputProperties } from '../../services/dataParser';

const { Text } = Typography;

interface RangeSliderProps {
  property: string;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  className?: string;
  showInputs?: boolean;
}

export default function RangeSlider({
  property,
  value,
  onChange,
  disabled = false,
  className,
  showInputs = true,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>([0, 100]);
  const [propertyRange, setPropertyRange] = useState<{ min: number; max: number } | null>(null);

  // Determine if property is input or output
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();
  const isInput = inputProperties.includes(property);
  const isOutput = outputProperties.includes(property);

  // Initialize property range and default values
  useEffect(() => {
    if (property && (isInput || isOutput)) {
      const range = getPropertyRange(property, isInput);
      if (range) {
        setPropertyRange(range);
        const defaultValue: [number, number] = [range.min, range.max];
        setInternalValue(defaultValue);
        
        // If no external value provided, notify parent with full range
        if (!value && onChange) {
          onChange(defaultValue);
        }
      }
    }
  }, [property, isInput, isOutput, value]);

  // Use external value if provided, otherwise use internal value
  const currentValue = value || internalValue;

  // Memoized tooltip formatter to prevent re-renders
  const tooltipFormatter = useCallback((value?: number) => value?.toFixed(2), []);

  // Handle slider change
  const handleSliderChange = useCallback((newValue: number | number[]) => {
    const rangeValue: [number, number] = Array.isArray(newValue) 
      ? [newValue[0], newValue[1]] 
      : [newValue, newValue];
    setInternalValue(rangeValue);
    onChange?.(rangeValue);
  }, [onChange]);

  // Handle input number changes
  const handleMinChange = useCallback((newMin: number | null) => {
    if (newMin !== null && propertyRange) {
      const clampedMin = Math.max(propertyRange.min, Math.min(newMin, currentValue[1]));
      const newValue: [number, number] = [clampedMin, currentValue[1]];
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  }, [propertyRange, currentValue, onChange]);

  const handleMaxChange = useCallback((newMax: number | null) => {
    if (newMax !== null && propertyRange) {
      const clampedMax = Math.min(propertyRange.max, Math.max(newMax, currentValue[0]));
      const newValue: [number, number] = [currentValue[0], clampedMax];
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  }, [propertyRange, currentValue, onChange]);

  // Show loading state if property range is not available
  if (!property) {
    return (
      <div className={className}>
        <Text type="secondary">Please select a property</Text>
      </div>
    );
  }

  if (!propertyRange) {
    return (
      <div className={className}>
        <Text type="secondary">Loading property range...</Text>
      </div>
    );
  }

  const { min, max } = propertyRange;
  const range = max - min;
  const step = range > 100 ? Math.round(range / 100) : range > 10 ? 0.1 : 0.01;

  return (
    <div className={className}>
      <Space direction="vertical" className="w-full">
        <div className="flex justify-between items-center">
          <Text strong>{property}</Text>
          <Text type="secondary" className="text-sm">
            Range: {min.toFixed(2)} - {max.toFixed(2)}
          </Text>
        </div>

        {showInputs && (
          <Row gutter={[8, 0]} align="middle">
            <Col span={5}>
              <InputNumber
                size="small"
                min={min}
                max={currentValue[1]}
                step={step}
                value={currentValue[0]}
                onChange={handleMinChange}
                disabled={disabled}
                precision={2}
                className="w-full"
              />
            </Col>
            <Col span={14}>
              <Slider
                range
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleSliderChange}
                disabled={disabled}
                tooltip={{
                  formatter: tooltipFormatter,
                }}
              />
            </Col>
            <Col span={5}>
              <InputNumber
                size="small"
                min={currentValue[0]}
                max={max}
                step={step}
                value={currentValue[1]}
                onChange={handleMaxChange}
                disabled={disabled}
                precision={2}
                className="w-full"
              />
            </Col>
          </Row>
        )}

        {!showInputs && (
          <Slider
            range
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleSliderChange}
            disabled={disabled}
            tooltip={{
              formatter: tooltipFormatter,
            }}
          />
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>Selected: {currentValue[0].toFixed(2)} - {currentValue[1].toFixed(2)}</span>
          <span>
            {((currentValue[1] - currentValue[0]) / range * 100).toFixed(1)}% of range
          </span>
        </div>
      </Space>
    </div>
  );
} 
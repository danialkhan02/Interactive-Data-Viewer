'use client';

import { Select, Typography, Space } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedInputs, setSelectedOutputs } from '../../store/datasetStore';
import { getInputProperties, getOutputProperties } from '../../services/dataParser';

const { Text } = Typography;
const { Option, OptGroup } = Select;

interface PropertySelectorProps {
  type: 'input' | 'output' | 'both';
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  multiple?: boolean;
}

export default function PropertySelector({ 
  type = 'both', 
  placeholder = 'Select properties...', 
  className,
  allowClear = true,
  multiple = true
}: PropertySelectorProps) {
  const dispatch = useAppDispatch();
  const { selectedInputs, selectedOutputs } = useAppSelector(state => state.dataset);

  // Get available properties
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();

  // Get currently selected values based on type
  const getSelectedValues = () => {
    if (multiple) {
      switch (type) {
        case 'input':
          return selectedInputs;
        case 'output':
          return selectedOutputs;
        case 'both':
          return [...selectedInputs, ...selectedOutputs];
        default:
          return [];
      }
    } else {
      // For single selection, return first item or undefined
      switch (type) {
        case 'input':
          return selectedInputs[0] || undefined;
        case 'output':
          return selectedOutputs[0] || undefined;
        case 'both':
          return [...selectedInputs, ...selectedOutputs][0] || undefined;
        default:
          return undefined;
      }
    }
  };

  // Handle selection changes
  const handleChange = (value: string | string[]) => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [value];
      if (type === 'input') {
        dispatch(setSelectedInputs(values));
      } else if (type === 'output') {
        dispatch(setSelectedOutputs(values));
      } else if (type === 'both') {
        // For 'both' type, separate into inputs and outputs
        const newInputs = values.filter(val => inputProperties.includes(val));
        const newOutputs = values.filter(val => outputProperties.includes(val));
        
        dispatch(setSelectedInputs(newInputs));
        dispatch(setSelectedOutputs(newOutputs));
      }
    } else {
      const singleValue = Array.isArray(value) ? value[0] : value;
      if (type === 'input') {
        dispatch(setSelectedInputs(singleValue ? [singleValue] : []));
      } else if (type === 'output') {
        dispatch(setSelectedOutputs(singleValue ? [singleValue] : []));
      } else if (type === 'both') {
        if (singleValue) {
          if (inputProperties.includes(singleValue)) {
            dispatch(setSelectedInputs([singleValue]));
            dispatch(setSelectedOutputs([]));
          } else if (outputProperties.includes(singleValue)) {
            dispatch(setSelectedInputs([]));
            dispatch(setSelectedOutputs([singleValue]));
          }
        } else {
          dispatch(setSelectedInputs([]));
          dispatch(setSelectedOutputs([]));
        }
      }
    }
  };

  // Render options based on type
  const renderOptions = () => {
    if (type === 'input') {
      return inputProperties.map(prop => (
        <Option key={prop} value={prop}>
          {prop}
        </Option>
      ));
    } else if (type === 'output') {
      return outputProperties.map(prop => (
        <Option key={prop} value={prop}>
          {prop}
        </Option>
      ));
    } else {
      // For 'both', group by input/output
      return [
        <OptGroup key="inputs" label="Input Properties">
          {inputProperties.map(prop => (
            <Option key={`input-${prop}`} value={prop}>
              {prop}
            </Option>
          ))}
        </OptGroup>,
        <OptGroup key="outputs" label="Output Properties">
          {outputProperties.map(prop => (
            <Option key={`output-${prop}`} value={prop}>
              {prop}
            </Option>
          ))}
        </OptGroup>
      ];
    }
  };

  const selectedValues = getSelectedValues();
  const selectedCount = multiple ? (selectedValues as string[]).length : (selectedValues ? 1 : 0);
  const totalCount = type === 'input' ? inputProperties.length 
                   : type === 'output' ? outputProperties.length 
                   : inputProperties.length + outputProperties.length;

  return (
    <Space direction="vertical" className="w-full">
      <div className="flex justify-between items-center">
        <Text strong>
          {type === 'input' ? 'Input Properties' 
           : type === 'output' ? 'Output Properties' 
           : 'Properties'}
        </Text>
        <Text type="secondary" className="text-sm">
          {multiple ? `${selectedCount} of ${totalCount} selected` : (selectedCount > 0 ? 'Selected' : 'None selected')}
        </Text>
      </div>
      
      <Select
        mode={multiple ? "multiple" : undefined}
        placeholder={placeholder}
        value={selectedValues}
        onChange={handleChange}
        className={`w-full ${className || ''}`}
        allowClear={allowClear}
        showSearch
        optionFilterProp="children"
        maxTagCount={multiple ? 3 : undefined}
        maxTagPlaceholder={multiple ? ((omittedValues) => `+${omittedValues.length} more`) : undefined}
      >
        {renderOptions()}
      </Select>
    </Space>
  );
} 
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
}

export default function PropertySelector({ 
  type = 'both', 
  placeholder = 'Select properties...', 
  className,
  allowClear = true 
}: PropertySelectorProps) {
  const dispatch = useAppDispatch();
  const { selectedInputs, selectedOutputs } = useAppSelector(state => state.dataset);

  // Get available properties
  const inputProperties = getInputProperties();
  const outputProperties = getOutputProperties();

  // Get currently selected values based on type
  const getSelectedValues = () => {
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
  };

  // Handle selection changes
  const handleChange = (values: string[]) => {
    if (type === 'input') {
      dispatch(setSelectedInputs(values));
    } else if (type === 'output') {
      dispatch(setSelectedOutputs(values));
    } else if (type === 'both') {
      // For 'both' type, separate into inputs and outputs
      const newInputs = values.filter(value => inputProperties.includes(value));
      const newOutputs = values.filter(value => outputProperties.includes(value));
      
      dispatch(setSelectedInputs(newInputs));
      dispatch(setSelectedOutputs(newOutputs));
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

  const selectedCount = getSelectedValues().length;
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
          {selectedCount} of {totalCount} selected
        </Text>
      </div>
      
      <Select
        mode="multiple"
        placeholder={placeholder}
        value={getSelectedValues()}
        onChange={handleChange}
        className={`w-full ${className || ''}`}
        allowClear={allowClear}
        showSearch
        optionFilterProp="children"
        maxTagCount={3}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
      >
        {renderOptions()}
      </Select>
    </Space>
  );
} 
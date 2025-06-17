import { Dataset, ExperimentData } from '../types';
import dataset from '../data/dataset.json';

/**
 * Loads the dataset from the JSON file
 * @returns The complete dataset
 */
export function loadDataset(): Dataset {
  return dataset as Dataset;
}

/**
 * Gets all experiment IDs from the dataset
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Array of experiment IDs
 */
export function getExperimentIds(data?: Dataset): string[] {
  const datasetToUse = data || loadDataset();
  return Object.keys(datasetToUse);
}

/**
 * Gets a specific experiment by ID
 * @param experimentId The experiment ID to retrieve
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns The experiment data or undefined if not found
 */
export function getExperiment(experimentId: string, data?: Dataset): ExperimentData | undefined {
  const datasetToUse = data || loadDataset();
  return datasetToUse[experimentId];
}

/**
 * Extracts all unique input property names from the dataset
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Array of input property names
 */
export function getInputProperties(data?: Dataset): string[] {
  const datasetToUse = data || loadDataset();
  const inputProperties = new Set<string>();
  
  Object.values(datasetToUse).forEach(experiment => {
    Object.keys(experiment.inputs).forEach(prop => {
      inputProperties.add(prop);
    });
  });
  
  return Array.from(inputProperties).sort();
}

/**
 * Extracts all unique output property names from the dataset
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Array of output property names
 */
export function getOutputProperties(data?: Dataset): string[] {
  const datasetToUse = data || loadDataset();
  const outputProperties = new Set<string>();
  
  Object.values(datasetToUse).forEach(experiment => {
    Object.keys(experiment.outputs).forEach(prop => {
      outputProperties.add(prop);
    });
  });
  
  return Array.from(outputProperties).sort();
}

/**
 * Gets all property names (inputs and outputs combined)
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Array of all property names
 */
export function getAllProperties(data?: Dataset): string[] {
  const inputs = getInputProperties(data);
  const outputs = getOutputProperties(data);
  return [...inputs, ...outputs];
}

/**
 * Gets the range (min, max) for a specific property across all experiments
 * @param propertyName The property to analyze
 * @param isInput Whether the property is an input (true) or output (false)
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Object with min and max values, or null if property not found
 */
export function getPropertyRange(
  propertyName: string, 
  isInput: boolean, 
  data?: Dataset
): { min: number; max: number } | null {
  const datasetToUse = data || loadDataset();
  const values: number[] = [];
  
  Object.values(datasetToUse).forEach(experiment => {
    const properties = isInput ? experiment.inputs : experiment.outputs;
    if (propertyName in properties) {
      values.push(properties[propertyName]);
    }
  });
  
  if (values.length === 0) {
    return null;
  }
  
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * Gets summary statistics for the dataset
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Object with dataset statistics
 */
export function getDatasetSummary(data?: Dataset) {
  const datasetToUse = data || loadDataset();
  const experimentIds = getExperimentIds(datasetToUse);
  const inputProperties = getInputProperties(datasetToUse);
  const outputProperties = getOutputProperties(datasetToUse);
  
  return {
    totalExperiments: experimentIds.length,
    inputProperties: inputProperties.length,
    outputProperties: outputProperties.length,
    inputPropertyNames: inputProperties,
    outputPropertyNames: outputProperties,
    dateRange: getDateRangeFromExperimentIds(experimentIds)
  };
}

/**
 * Parses dates from experiment IDs (format: YYYYMMDD_EXP_XX)
 * @param experimentIds Array of experiment IDs
 * @returns Object with earliest and latest dates, or null if no valid dates found
 */
export function getDateRangeFromExperimentIds(experimentIds: string[]): { earliest: Date; latest: Date } | null {
  const dates: Date[] = [];
  
  experimentIds.forEach(id => {
    const dateMatch = id.match(/^(\d{8})/);
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(dateStr.substring(6, 8));
      
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        dates.push(date);
      }
    }
  });
  
  if (dates.length === 0) {
    return null;
  }
  
  return {
    earliest: new Date(Math.min(...dates.map(d => d.getTime()))),
    latest: new Date(Math.max(...dates.map(d => d.getTime())))
  };
}

/**
 * Filters experiments based on property ranges
 * @param filters Object mapping property names to [min, max] ranges
 * @param data Optional dataset, uses loaded dataset if not provided
 * @returns Filtered dataset
 */
export function filterExperiments(
  filters: Record<string, [number, number]>, 
  data?: Dataset
): Dataset {
  const datasetToUse = data || loadDataset();
  const filtered: Dataset = {};
  
  Object.entries(datasetToUse).forEach(([experimentId, experiment]) => {
    let passesAllFilters = true;
    
    Object.entries(filters).forEach(([property, [min, max]]) => {
      const inputValue = experiment.inputs[property];
      const outputValue = experiment.outputs[property];
      
      // Check if the property exists in inputs or outputs and is within range
      let propertyValue: number | undefined;
      if (inputValue !== undefined) {
        propertyValue = inputValue;
      } else if (outputValue !== undefined) {
        propertyValue = outputValue;
      }
      
      if (propertyValue === undefined || propertyValue < min || propertyValue > max) {
        passesAllFilters = false;
      }
    });
    
    if (passesAllFilters) {
      filtered[experimentId] = experiment;
    }
  });
  
  return filtered;
} 
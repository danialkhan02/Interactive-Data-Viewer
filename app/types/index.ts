// Core experiment data interfaces
export interface ExperimentData {
  inputs: Record<string, number>;
  outputs: Record<string, number>;
}

export type Dataset = Record<string, ExperimentData>;

// More specific type definitions based on the actual dataset structure
export interface ExperimentInputs {
  "Polymer 1": number;
  "Polymer 2": number;
  "Polymer 3": number;
  "Polymer 4": number;
  "Carbon Black High Grade": number;
  "Carbon Black Low Grade": number;
  "Silica Filler 1": number;
  "Silica Filler 2": number;
  "Plasticizer 1": number;
  "Plasticizer 2": number;
  "Plasticizer 3": number;
  "Antioxidant": number;
  "Coloring Pigment": number;
  "Co-Agent 1": number;
  "Co-Agent 2": number;
  "Co-Agent 3": number;
  "Curing Agent 1": number;
  "Curing Agent 2": number;
  "Oven Temperature": number;
}

export interface ExperimentOutputs {
  "Viscosity": number;
  "Cure Time": number;
  "Elongation": number;
  "Tensile Strength": number;
  "Compression Set": number;
}

// Strongly typed experiment data with specific property names
export interface TypedExperimentData {
  inputs: ExperimentInputs;
  outputs: ExperimentOutputs;
}

export type TypedDataset = Record<string, TypedExperimentData>;

// Redux store state types
export interface DatasetState {
  selectedInputs: string[];
  selectedOutputs: string[];
  selectedExperimentId: string;
  filterRange: Record<string, [number, number]>;
  // Histogram-specific state
  histogram: {
    selectedOutput: string;
    outputRange: [number, number] | null;
  };
}

// Utility types for working with properties
export type InputProperty = keyof ExperimentInputs;
export type OutputProperty = keyof ExperimentOutputs;
export type PropertyName = InputProperty | OutputProperty;

// Chart data types
export interface ChartDataPoint {
  x: number;
  y: number;
  experimentId: string;
}

// Filter types
export interface PropertyFilter {
  property: string;
  min: number;
  max: number;
}

export interface FilteredResult {
  experimentId: string;
  data: ExperimentData;
  matchScore?: number;
}

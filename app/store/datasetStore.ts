import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { DatasetState } from '../types';

// Initial state based on DatasetState interface
const initialState: DatasetState = {
  selectedInputs: [],
  selectedOutputs: [],
  selectedExperimentId: '',
  filterRange: {},
  // Histogram-specific state
  histogram: {
    selectedOutput: '',
    outputRange: null,
  },
};

// Create the dataset slice
const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    // Actions for managing selected inputs
    setSelectedInputs: (state, action: PayloadAction<string[]>) => {
      state.selectedInputs = action.payload;
    },
    addSelectedInput: (state, action: PayloadAction<string>) => {
      if (!state.selectedInputs.includes(action.payload)) {
        state.selectedInputs.push(action.payload);
      }
    },
    removeSelectedInput: (state, action: PayloadAction<string>) => {
      state.selectedInputs = state.selectedInputs.filter(input => input !== action.payload);
    },
    clearSelectedInputs: (state) => {
      state.selectedInputs = [];
    },

    // Actions for managing selected outputs
    setSelectedOutputs: (state, action: PayloadAction<string[]>) => {
      state.selectedOutputs = action.payload;
    },

    // Histogram-specific actions
    setHistogramOutput: (state, action: PayloadAction<string>) => {
      state.histogram.selectedOutput = action.payload;
      // Reset range when output changes
      state.histogram.outputRange = null;
    },
    setHistogramRange: (state, action: PayloadAction<[number, number] | null>) => {
      state.histogram.outputRange = action.payload;
    },
    resetHistogramState: (state) => {
      state.histogram = {
        selectedOutput: '',
        outputRange: null,
      };
    },

    // Action to reset entire state
    resetDatasetState: () => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setSelectedInputs,
  addSelectedInput,
  removeSelectedInput,
  clearSelectedInputs,
  setSelectedOutputs,
  setHistogramOutput,
  setHistogramRange,
  resetHistogramState,
  resetDatasetState,
} = datasetSlice.actions;

// Configure the store
export const store = configureStore({
  reducer: {
    dataset: datasetSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the reducer
export default datasetSlice.reducer; 
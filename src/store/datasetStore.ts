import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { DatasetState } from '../types';

// Initial state based on DatasetState interface
const initialState: DatasetState = {
  selectedInputs: [],
  selectedOutputs: [],
  correlationType: 'pearson',
  selectedExperimentId: '',
  filterRange: {},
  similarityCount: 5,
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
    addSelectedOutput: (state, action: PayloadAction<string>) => {
      if (!state.selectedOutputs.includes(action.payload)) {
        state.selectedOutputs.push(action.payload);
      }
    },
    removeSelectedOutput: (state, action: PayloadAction<string>) => {
      state.selectedOutputs = state.selectedOutputs.filter(output => output !== action.payload);
    },
    clearSelectedOutputs: (state) => {
      state.selectedOutputs = [];
    },

    // Actions for correlation type
    setCorrelationType: (state, action: PayloadAction<'pearson' | 'spearman'>) => {
      state.correlationType = action.payload;
    },

    // Actions for selected experiment
    setSelectedExperimentId: (state, action: PayloadAction<string>) => {
      state.selectedExperimentId = action.payload;
    },
    clearSelectedExperimentId: (state) => {
      state.selectedExperimentId = '';
    },

    // Actions for filter ranges
    setFilterRange: (state, action: PayloadAction<Record<string, [number, number]>>) => {
      state.filterRange = action.payload;
    },
    setPropertyFilterRange: (state, action: PayloadAction<{ property: string; range: [number, number] }>) => {
      state.filterRange[action.payload.property] = action.payload.range;
    },
    removePropertyFilter: (state, action: PayloadAction<string>) => {
      delete state.filterRange[action.payload];
    },
    clearAllFilters: (state) => {
      state.filterRange = {};
    },

    // Actions for similarity count
    setSimilarityCount: (state, action: PayloadAction<number>) => {
      state.similarityCount = Math.max(1, action.payload); // Ensure at least 1
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
  addSelectedOutput,
  removeSelectedOutput,
  clearSelectedOutputs,
  setCorrelationType,
  setSelectedExperimentId,
  clearSelectedExperimentId,
  setFilterRange,
  setPropertyFilterRange,
  removePropertyFilter,
  clearAllFilters,
  setSimilarityCount,
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
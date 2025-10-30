import { configureStore } from '@reduxjs/toolkit';
import fileExplorerReducer from './fileExplorerSlice';

export const store = configureStore({
  reducer: {
    fileExplorer: fileExplorerReducer,
  },
});
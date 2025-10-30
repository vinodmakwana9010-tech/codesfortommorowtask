import { configureStore } from '@reduxjs/toolkit';
import fileSystemReducer from './fileSystemSlice';

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
  },
});
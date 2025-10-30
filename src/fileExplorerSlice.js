import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [
    { id: 1, name: 'root', type: 'folder', children: [] }
  ],
};

export const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    // Example reducer to add a file/folder.
    // You can expand this with more actions like delete, rename, etc.
    addEntry: (state, action) => {
      // This is a simplified example. A real implementation would need
      // to find the correct parent folder to add the new entry to.
      console.log('Reducer: addEntry', action.payload);
    },
  },
});

export const { addEntry } = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;
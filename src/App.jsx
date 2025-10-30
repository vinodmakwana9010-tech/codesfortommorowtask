import React from 'react';
import { Provider } from 'react-redux';
import FileExplorer from './components/FileExplorer';
import './index.css';
import { store } from '../src/index';

function App() {
  return (
    <Provider store={store}>
      <FileExplorer />
    </Provider>
  );
}

export default App
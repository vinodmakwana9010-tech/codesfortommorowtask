export const mockData = {
  id: 'root',
  name: 'root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'public',
      type: 'folder',
      children: [
        { id: '2', name: 'index.html', type: 'file', content: '<html><body></body></html>' },
        { id: '3', name: 'vite.svg', type: 'file', content: '<svg>...</svg>' },
      ],
    },
    {
      id: '4',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: '5',
          name: 'components',
          type: 'folder',
          children: [
            { id: '6', name: 'Button.jsx', type: 'file', content: 'export default () => <button>Click me</button>;' },
          ],
        },
        { id: '7', name: 'App.jsx', type: 'file', content: 'import React from "react";' },
        { id: '8', name: 'main.jsx', type: 'file', content: 'import ReactDOM from "react-dom";' },
      ],
    },
    {
      id: '9',
      name: 'package.json',
      type: 'file',
      content: '{ "name": "my-project" }'
    },
  ],
};
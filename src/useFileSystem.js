import { useState, useCallback } from 'react';

const initialFileSystem = {
  id: 'root',
  name: 'root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'public',
      type: 'folder',
      children: [
        { id: '2', name: 'index.html', type: 'file', content: '<html><body>Hello World</body></html>' },
      ],
    },
    {
      id: '3',
      name: 'src',
      type: 'folder',
      children: [
        { id: '4', name: 'App.jsx', type: 'file', content: 'import React from "react";' },
        { id: '5', name: 'main.jsx', type: 'file', content: 'import React from "react";' },
      ],
    },
    { id: '6', name: 'package.json', type: 'file', content: '{ "name": "my-project" }' },
  ],
};

const findNodeAndParent = (root, nodeId) => {
  const queue = [{ node: root, parent: null }];
  while (queue.length > 0) {
    const { node, parent } = queue.shift();
    if (node.id === nodeId) {
      return { node, parent };
    }
    if (node.type === 'folder' && node.children) {
      node.children.forEach(child => queue.push({ node: child, parent: node }));
    }
  }
  return { node: null, parent: null };
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  const findNodeById = useCallback((nodeId, root = fileSystem) => {
    if (root.id === nodeId) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeById(nodeId, child);
        if (found) return found;
      }
    }
    return null;
  }, [fileSystem]);

  const createFile = useCallback((parentId, name, type) => {
    setFileSystem(currentFileSystem => {
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));
      const { node: parent } = findNodeAndParent(newFS, parentId);
      if (parent && parent.type === 'folder') {
        const newNode = { id: Date.now().toString(), name, type };
        if (type === 'folder') newNode.children = [];
        else newNode.content = '';
        parent.children.push(newNode);
      }
      return newFS;
    });
  }, []);

  const deleteItem = useCallback((nodeId) => {
    setFileSystem(currentFileSystem => {
      if (nodeId === 'root') return currentFileSystem; // Cannot delete root
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));
      const { parent } = findNodeAndParent(newFS, nodeId);
      if (parent) {
        parent.children = parent.children.filter(child => child.id !== nodeId);
      }
      return newFS;
    });
  }, []);

  const renameItem = useCallback((nodeId, newName) => {
    setFileSystem(currentFileSystem => {
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));
      const { node } = findNodeAndParent(newFS, nodeId);
      if (node) {
        node.name = newName;
      }
      return newFS;
    });
  }, []);

  return {
    fileSystem,
    findNodeById,
    createFile,
    deleteItem,
    renameItem,
  };
};
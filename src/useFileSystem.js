import { useState, useCallback, useEffect } from 'react';

const initialFileSystem = {
  id: 'root',
  name: 'root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'project-assets',
      type: 'folder',
      children: [
        { id: '2', name: 'home.html', type: 'file', content: '<html><body>Welcome to the homepage!</body></html>' },
      ],
    },
    {
      id: '3',
      name: 'source-code',
      type: 'folder',
      children: [
        { id: '4', name: 'Application.jsx', type: 'file', content: 'import React from "react";\n\nfunction Application() {\n  return <div>My App</div>;\n}' },
        { id: '5', name: 'index.js', type: 'file', content: 'console.log("hello world");' },
      ],
    },
    { id: '6', name: 'config.json', type: 'file', content: '{ "name": "my-new-project", "version": "1.0.0" }' },
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
  const [fileSystem, setFileSystem] = useState(() => {
    try {
      const storedFS = localStorage.getItem('fileSystem');
      return storedFS ? JSON.parse(storedFS) : initialFileSystem;
    } catch (error) {
      console.error("Could not read from localStorage", error);
      return initialFileSystem;
    }
  });

  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

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

  const moveItem = useCallback((sourceId, destinationId) => {
    setFileSystem(currentFileSystem => {
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));

      let sourceNode = null;
      let sourceParent = null;

      // Find source node and its parent
      function findSource(node, parent) {
        if (node.id === sourceId) {
          sourceNode = node;
          sourceParent = parent;
          return;
        }
        if (node.children) {
          for (const child of node.children) {
            findSource(child, node);
            if (sourceNode) return;
          }
        }
      }
      findSource(newFS, null);

      if (!sourceNode || !sourceParent) return currentFileSystem;

      const destinationNode = findNodeById(destinationId, newFS);

      if (!destinationNode || destinationNode.type !== 'folder' || destinationNode.id === sourceParent.id) {
        return currentFileSystem;
      }

      const sourceIndex = sourceParent.children.findIndex(child => child.id === sourceId);
      sourceParent.children.splice(sourceIndex, 1);
      destinationNode.children.push(sourceNode);

      return newFS;
    });
  }, [findNodeById]);

  const updateFileContent = useCallback((fileId, content) => {
    setFileSystem(currentFileSystem => {
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));
      // findNodeById is not safe to use on newFS if it's not memoized with it
      // but for this case, it should be fine as we are creating a new object each time.
      const file = findNodeById(fileId, newFS);
      if (file && file.type === 'file') {
        file.content = content;
      }
      return newFS;
    });
  }, [findNodeById]);

  const copyItem = useCallback((sourceId, destinationId) => {
    setFileSystem(currentFileSystem => {
      const newFS = JSON.parse(JSON.stringify(currentFileSystem));
      const sourceNode = findNodeById(sourceId, newFS);
      const destinationNode = findNodeById(destinationId, newFS);

      if (!sourceNode || !destinationNode || destinationNode.type !== 'folder') {
        return currentFileSystem;
      }

      function deepCloneWithNewIds(node) {
        const newNode = { ...node, id: Date.now().toString() + Math.random() };
        if (node.children) {
          newNode.children = node.children.map(deepCloneWithNewIds);
        }
        return newNode;
      }

      const clonedNode = deepCloneWithNewIds(sourceNode);
      destinationNode.children.push(clonedNode);
      return newFS;
    });
  }, [findNodeById]);

  return {
    fileSystem,
    findNodeById,
    createFile,
    deleteItem,
    renameItem,
    moveItem,
    updateFileContent,
    copyItem
  };
};
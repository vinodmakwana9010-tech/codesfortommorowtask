import { useState } from 'react';
import { mockData } from '../data/mockData';

const findItem = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findParent = (items, id, parent = null) => {
  for (const item of items) {
    if (item.id === id) return parent;
    if (item.children) {
      const found = findParent(item.children, id, item);
      if (found) return found;
    }
  }
  return null;
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState(mockData);

  const findNodeById = (id) => {
    return findItem([fileSystem], id);
  };

  const createFile = (parentId, name, type) => {
    setFileSystem(prevFileSystem => {
      const newFileSystem = JSON.parse(JSON.stringify(prevFileSystem));
      const parent = findItem([newFileSystem], parentId);
      if (parent && parent.type === 'folder') {
        if (parent.children.some(child => child.name === name)) {
          alert('An item with this name already exists in this folder.');
          return prevFileSystem;
        }
        const newItem = {
          id: Date.now().toString(),
          name,
          type,
          content: type === 'file' ? '' : undefined,
          children: type === 'folder' ? [] : undefined,
        };
        parent.children.push(newItem);
      }
      return newFileSystem;
    });
  };

  const deleteItem = (id) => {
    if (id === 'root') {
      alert("Cannot delete the root directory.");
      return;
    }
    setFileSystem(prevFileSystem => {
      const newFileSystem = JSON.parse(JSON.stringify(prevFileSystem));
      const parent = findParent([newFileSystem], id);
      if (parent && parent.children) {
        parent.children = parent.children.filter(child => child.id !== id);
      }
      return newFileSystem;
    });
  };

  const renameItem = (id, newName) => {
    if (id === 'root') {
      alert("Cannot rename the root directory.");
      return;
    }
    setFileSystem(prevFileSystem => {
      const newFileSystem = JSON.parse(JSON.stringify(prevFileSystem));
      const item = findItem([newFileSystem], id);
      const parent = findParent([newFileSystem], id);
      if (item) {
        if (parent && parent.children.some(child => child.name === newName && child.id !== id)) {
          alert('An item with this name already exists in this folder.');
          return prevFileSystem;
        }
        item.name = newName;
      }
      return newFileSystem;
    });
  };

  const openFile = (id) => {
    const item = findNodeById(id);
    if (item && item.type === 'file') {
      return item;
    }
    return null;
  };

  const getChildren = (folderId) => {
    const folder = findNodeById(folderId);
    return folder ? folder.children : [];
  };


  return {
    fileSystem,
    createFile,
    deleteItem,
    renameItem,
    openFile,
    getChildren,
    findNodeById,
  };
};
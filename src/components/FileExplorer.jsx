import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useFileSystem } from '../useFileSystem';
import TreeNode from './TreeNode';
import FileContent from './FileContent';

const FileExplorer = () => {
  const { fileSystem, createFile, deleteItem, renameItem, findNodeById, moveItem, updateFileContent } = useFileSystem();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const handleFileOperation = (operation, ...args) => {
    switch (operation) {
      case 'create':
        createFile(...args);
        break;
      case 'delete':
        deleteItem(...args);
        break;
      case 'rename':
        renameItem(...args);
        break;
      case 'move':
        moveItem(...args);
        break;
      case 'updateContent':
        updateFileContent(...args);
        break;
      default:
        break;
    }
  };

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      if (newWidth > 200 && newWidth < window.innerWidth * 0.5) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  return (
    <div className="file-explorer">
      <div className="file-explorer-sidebar" style={{ width: `${sidebarWidth}px` }}>
        <h1 className="file-explorer-header">File Explorer</h1>
        <input
          type="text"
          placeholder="Search files and folders..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TreeNode node={fileSystem} onFileOperation={handleFileOperation} searchTerm={searchTerm} />
      </div>
      <div className="resizer" onMouseDown={handleMouseDown}></div>
      <div className="file-explorer-content" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
        <Routes>
          <Route path="/file/:fileId" element={<FileContent findNodeById={findNodeById} onFileOperation={handleFileOperation} />} />
          <Route path="/" element={<div className="file-explorer-message">Select a file to view its content.</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default FileExplorer;
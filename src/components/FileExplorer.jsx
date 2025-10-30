import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useFileSystem } from '../useFileSystem';
import TreeNode from './TreeNode';
import FileContent from './FileContent';

const FileExplorer = () => {
  const { fileSystem, createFile, deleteItem, renameItem, findNodeById, moveItem, updateFileContent } = useFileSystem();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
    <div className={`file-explorer ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="file-explorer-sidebar" style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0px' }}>
        <div className="sidebar-content">
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
        <button onClick={toggleSidebar} className="sidebar-toggle" title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/></svg>
        </button>
      </div>
      {isSidebarOpen && <div className="resizer" onMouseDown={handleMouseDown}></div>}
      <div className="file-explorer-content">
        <Routes>
          <Route path="/file/:fileId" element={<FileContent findNodeById={findNodeById} onFileOperation={handleFileOperation} />} />
          <Route path="/" element={<div className="file-explorer-message">Select a file to view its content.</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default FileExplorer;
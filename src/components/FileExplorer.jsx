import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useFileSystem } from '../useFileSystem';
import TreeNode from './TreeNode';
import FileContent from './FileContent';

const FileExplorer = () => {
  const { fileSystem, createFile, deleteItem, renameItem, findNodeById, moveItem, copyItem, updateFileContent } = useFileSystem() || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [clipboard, setClipboard] = useState(null); // { sourceId: string, operation: 'copy' | 'cut' }
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
        setClipboard(null); // Clear clipboard after move
        break;
      case 'copy':
        copyItem(...args);
        break;
      case 'update':
        updateFileContent(...args);
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
          <h1 className="file-explorer-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon header-icon">
              <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.25a3 3 0 0 0-2.625.432l-4.243 4.242a3 3 0 0 1-4.242 0l-1.273-1.273a.75.75 0 0 0-1.06 1.06l1.273 1.273a4.5 4.5 0 0 0 6.364 0l4.243-4.242a1.5 1.5 0 0 1 1.06-.432H19.5z" />
              <path d="M5.25 4.5c-1.518 0-2.75 1.232-2.75 2.75v10.5c0 1.518 1.232 2.75 2.75 2.75h10.5c.836 0 1.579-.37 2.098-.97l-8.598-8.598a.75.75 0 0 0-1.06-1.06L5.25 15.375v-2.625a.75.75 0 0 0-1.5 0v2.625c0 .134.011.265.032.393a.75.75 0 0 0 1.436.234V7.25c0-.69.56-1.25 1.25-1.25h3.375a.75.75 0 0 0 0-1.5H5.25z" />
            </svg>
            File Explorer
          </h1>
          <input
            type="text"
            placeholder="Search files and folders..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <TreeNode
          node={fileSystem}
          onFileOperation={handleFileOperation}
          searchTerm={searchTerm}
          clipboard={clipboard}
          setClipboard={setClipboard} />
      </div>
      <button onClick={toggleSidebar} className="sidebar-toggle" title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/></svg>
      </button>
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
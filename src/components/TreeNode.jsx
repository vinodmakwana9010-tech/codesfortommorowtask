import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContextMenu from './ContextMenu';

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon"><path d="M2 6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" /></svg>;
const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon"><path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H7z" clipRule="evenodd" /></svg>;
const CreateFileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5zM10 6a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 10 6z" /></svg>;
const CreateFolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path d="M2 6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.25 3.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5zM10 9.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5zM14.75 9.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.5-1.004c.717-.119 1.47-.217 2.22-.292v10.162a2.75 2.75 0 0 0 2.75 2.75h3.5a2.75 2.75 0 0 0 2.75-2.75V4.499c.75-.075 1.492-.173 2.207-.293l.501 1.004a.75.75 0 1 0 .23-1.482c-.78-.122-1.563-.22-2.35-.297V3.75A2.75 2.75 0 0 0 11.25 1h-3.5zM10 4.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9z" clipRule="evenodd" /></svg>;
const RenameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0v2.25h2.25a1.125 1.125 0 0 1 0 2.25H4.875v2.25a1.125 1.125 0 1 1-2.25 0v-2.25H.375a1.125 1.125 0 0 1 0-2.25h2.25V6.75zM10 12.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75zM10 7.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path fillRule="evenodd" d="M15.75 2.25H12A2.25 2.25 0 0 0 9.75 0H4.5A2.25 2.25 0 0 0 2.25 2.25v11.5A2.25 2.25 0 0 0 4.5 16h8.25a2.25 2.25 0 0 0 2.25-2.25V2.25zM4.5 1.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75H4.5zM17.25 4.5a.75.75 0 0 0-.75.75v11.5c0 .414-.336.75-.75.75H5.25a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 .75.75h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a.75.75 0 0 0-.75-.75z" clipRule="evenodd" /></svg>;
const CutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path fillRule="evenodd" d="M15.75 2.25H12A2.25 2.25 0 0 0 9.75 0H4.5A2.25 2.25 0 0 0 2.25 2.25v11.5A2.25 2.25 0 0 0 4.5 16h8.25a2.25 2.25 0 0 0 2.25-2.25V2.25zM4.5 1.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75H4.5zM17.25 4.5a.75.75 0 0 0-.75.75v11.5c0 .414-.336.75-.75.75H5.25a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 .75.75h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a.75.75 0 0 0-.75-.75z" clipRule="evenodd" /></svg>;
const PasteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-sm"><path fillRule="evenodd" d="M15.75 2.25H12A2.25 2.25 0 0 0 9.75 0H4.5A2.25 2.25 0 0 0 2.25 2.25v11.5A2.25 2.25 0 0 0 4.5 16h8.25a2.25 2.25 0 0 0 2.25-2.25V2.25zM4.5 1.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75H4.5zM17.25 4.5a.75.75 0 0 0-.75.75v11.5c0 .414-.336.75-.75.75H5.25a.75.75 0 0 0-.75.75v.75a.75.75 0 0 0 .75.75h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a.75.75 0 0 0-.75-.75z" clipRule="evenodd" /></svg>;

const TreeNode = ({ node, onFileOperation, searchTerm, clipboard, setClipboard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [contextMenu, setContextMenu] = useState(null);
  const location = useLocation();
  const isActive = location.pathname.includes(node.id);

  useEffect(() => {
    if (searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      // If a child matches, expand its parents
      let current = node;
      while (current.parentId) { // Assuming nodes have a parentId for traversal
        // This part would require a way to update parent's state,
        // which is usually done by passing a function up or using a global state.
        // For simplicity, we'll just expand the current node if it matches.
        setIsExpanded(true);
        break; // Stop after expanding one level up
      }
    }
  }, [searchTerm, node.name]);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleRename = () => {
    if (newName.trim() !== '' && newName !== node.name) {
      onFileOperation('rename', node.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleCreate = (type) => {
    const name = prompt(`Enter name for new ${type}:`);
    if (name) {
      onFileOperation('create', node.id, name, type);
    }
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
      onFileOperation('delete', node.id);
    }
    setContextMenu(null);
  };

  const handleCopy = () => {
    setClipboard({ sourceId: node.id, operation: 'copy' });
    setContextMenu(null);
  };

  const handleCut = () => {
    setClipboard({ sourceId: node.id, operation: 'cut' });
    setContextMenu(null);
  };

  const handlePaste = () => {
    if (clipboard && node.type === 'folder') {
      if (clipboard.operation === 'copy') {
        onFileOperation('copy', clipboard.sourceId, node.id);
      } else if (clipboard.operation === 'cut') {
        onFileOperation('move', clipboard.sourceId, node.id);
      }
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        node.type === 'folder' && { label: 'New File', onClick: () => handleCreate('file'), icon: <CreateFileIcon /> },
        node.type === 'folder' && { label: 'New Folder', onClick: () => handleCreate('folder'), icon: <CreateFolderIcon /> },
        { label: 'Rename', onClick: () => setIsEditing(true), icon: <RenameIcon /> },
        { label: 'Copy', onClick: handleCopy, icon: <CopyIcon /> },
        { label: 'Cut', onClick: handleCut, icon: <CutIcon /> },
        node.type === 'folder' && clipboard && { label: 'Paste', onClick: handlePaste, icon: <PasteIcon /> },
        { label: 'Delete', onClick: handleDelete, className: 'delete', icon: <DeleteIcon /> },
      ].filter(Boolean), // Filter out nulls for non-folder specific actions
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (sourceId && sourceId !== node.id && node.type === 'folder') {
      onFileOperation('move', sourceId, node.id);
    }
    e.target.classList.remove('drop-target');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === 'folder') {
      e.dataTransfer.dropEffect = 'move';
      e.target.classList.add('drop-target');
    }
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    e.target.classList.remove('drop-target');
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const renderNode = () => {
    const isFile = node.type === 'file';
    const icon = isFile ? <FileIcon className="file-icon" /> : <FolderIcon className="folder-icon" />;
    const nodeClass = `tree-node-item ${isActive ? 'active' : ''}`;

    if (isEditing) {
      return (
        <div className={nodeClass}>
          {icon}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              }
            }}
            autoFocus
            className="editing-input"
          />
        </div>
      );
    }

    const nodeContent = (
      <div
        className="tree-node-content"
        onClick={isFile ? undefined : toggleExpand}
        onContextMenu={handleContextMenu}
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {icon}
        {isFile ? (
          <Link to={`/file/${node.id}`} className={isActive ? 'active' : ''}>
            {node.name}
          </Link>
        ) : (
          <span>{node.name}</span>
        )}
        {node.type === 'folder' && node.children && node.children.length > 0 && (
          <span className="folder-toggle-icon">{isExpanded ? '▼' : '▶'}</span>
        )}
      </div>
    );

    return (
      <div className={nodeClass}>
        {nodeContent}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            show={true}
            onClose={() => setContextMenu(null)}
            items={contextMenu.items}
          />
        )}
      </div>
    );
  };

  if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase()) && !isExpanded) {
    return null;
  }

  return (
    <div className="tree-node">
      {renderNode()}
      {isExpanded && node.children && (
        <div style={{ paddingLeft: '15px' }}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onFileOperation={onFileOperation}
              searchTerm={searchTerm}
              clipboard={clipboard}
              setClipboard={setClipboard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
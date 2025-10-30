import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FolderIcon from '../../FolderIcon';
import FileIcon from '../../FileIcon';
import CreateFileIcon from '../../CreateFileIcon';
import CreateFolderIcon from '../../CreateFolderIcon';
import EditIcon from '../../EditIcon';
import DeleteIcon from '../../DeleteIcon';

const doesMatchSearch = (node, searchTerm) => {
  if (!searchTerm) return true;
  const nameMatch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
  if (nameMatch) return true;
  if (node.type === 'folder' && node.children) {
    return node.children.some(child => doesMatchSearch(child, searchTerm));
  }
  return false;
};

const TreeNode = ({ node, onFileOperation, level = 0, searchTerm = "" }) => {
  const [isOpen, setIsOpen] = useState(!!searchTerm);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [isCreating, setIsCreating] = useState(null); // { type: 'file' | 'folder' }
  const [isDropTarget, setIsDropTarget] = useState(false);

  useEffect(() => {
    setIsOpen(!!searchTerm);
  }, [searchTerm]);
  
  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleRename = () => {
    if (isEditing) {
      onFileOperation('rename', node.id, newName);
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
      onFileOperation('delete', node.id);
    }
  };

  const startCreate = (type) => {
    setIsOpen(true);
    setIsCreating({ type });
  };

  const handleNewNodeConfirm = (name) => {
    if (name && isCreating) {
      onFileOperation('create', node.id, name, isCreating.type);
    }
    setIsCreating(null);
  };

  const handleNewNodeCancel = () => {
    setIsCreating(null);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: node.id, type: node.type }));
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    if (node.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      setIsDropTarget(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
    if (node.type === 'folder') {
      const transferData = JSON.parse(e.dataTransfer.getData('application/json'));
      // एक आइटम को उसी के अंदर नहीं डाला जा सकता
      if (transferData.id !== node.id) {
        onFileOperation('move', transferData.id, node.id);
      }
    }
  };

  const nodeContent = (
    <div className="tree-node-content">
      {node.type === 'folder' ? <FolderIcon /> : <FileIcon />}
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          autoFocus
          className="editing-input"
        />
      ) : (
        <span onDoubleClick={handleToggle}>
          {node.type === 'file' ? (
            <Link to={`/file/${node.id}`}>{node.name}</Link>
          ) : (
            <span onClick={handleToggle}>{node.name}</span>
          )}
        </span>
      )}
    </div>
  );

  if (!doesMatchSearch(node, searchTerm) && level > 0) {
    return null;
  }

  const isActive = node.type === 'file' && location.pathname === `/file/${node.id}`;

  return (
    <div
      style={{ paddingLeft: `${level * 20}px` }}
      className="tree-node"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div
        className={`tree-node-item ${isDropTarget ? 'drop-target' : ''} ${isActive ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        {nodeContent}
        <div className="tree-node-actions">
          {node.type === 'folder' && !isEditing && (
            <>
              <button onClick={() => startCreate('file')} title="New File"><CreateFileIcon /></button>
              <button onClick={() => startCreate('folder')} title="New Folder"><CreateFolderIcon /></button>
            </>
          )}
          {!isEditing && <button onClick={handleRename} title="Rename"><EditIcon /></button>}
          {!isEditing && <button onClick={handleDelete} title="Delete"><DeleteIcon /></button>}
        </div>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children
            .filter(child => doesMatchSearch(child, searchTerm))
            .map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onFileOperation={onFileOperation}
              level={level + 1}
              searchTerm={searchTerm}
            />
          ))}
          {isCreating && (
            <NewNodeInput
              type={isCreating.type}
              onConfirm={handleNewNodeConfirm}
              onCancel={handleNewNodeCancel}
              level={level + 1}
            />
          )}
        </div>
      )}
    </div>
  );
};

const NewNodeInput = ({ type, onConfirm, onCancel, level }) => {
  const [name, setName] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onConfirm(name);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div style={{ paddingLeft: `${level * 20}px` }} className="tree-node-item">
      <div className="tree-node-content">
        {type === 'folder' ? <FolderIcon /> : <FileIcon />}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onConfirm(name)} // Confirm on blur
          onKeyDown={handleKeyDown}
          autoFocus
          className="editing-input"
        />
      </div>
    </div>
  );
};

export default TreeNode;
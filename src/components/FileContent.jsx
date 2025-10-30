import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const findNodeById = (root, nodeId) => {
  if (root.id === nodeId) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }
  return null;
};

const FileContent = ({ onFileOperation }) => {
  const { fileId } = useParams();
  const file = useSelector(state => findNodeById(state.fileSystem, fileId));
  const [content, setContent] = useState(file?.content || '');

  useEffect(() => {
    setContent(file?.content || '');
  }, [file]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onFileOperation('update', fileId, content);
    alert('File saved!');
  };

  if (!file) {
    return <div className="file-content-container">File not found. <Link to="/" className="go-back-link">Go back</Link></div>;
  }

  return (
    <div className="file-content-container">
      <h2 className="file-content-header">{file.name} <button onClick={handleSave} className="save-button">Save</button></h2>
      <textarea className="file-content-editor" value={content} onChange={handleContentChange}></textarea>
    </div>
  );
};

export default FileContent;
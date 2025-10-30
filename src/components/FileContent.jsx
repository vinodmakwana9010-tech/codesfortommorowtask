import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const FileContent = ({ findNodeById, onFileOperation }) => {
  const { fileId } = useParams();
  const file = findNodeById(fileId);
  const [content, setContent] = useState(file?.content || '');

  useEffect(() => {
    setContent(file?.content || '');
  }, [file]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onFileOperation('updateContent', fileId, content);
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
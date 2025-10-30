import React from 'react';
import { useParams, Link } from 'react-router-dom';

const FileContent = ({ findNodeById }) => {
  const { fileId } = useParams();
  const file = findNodeById(fileId);

  if (!file) {
    return <div className="file-content-container">File not found. <Link to="/" className="go-back-link">Go back</Link></div>;
  }

  return (
    <div className="file-content-container">
      <h2 className="file-content-header">{file.name}</h2>
      <pre className="file-content-code">{file.content}</pre>
    </div>
  );
};

export default FileContent;
import React from 'react';
import { downloadCSV } from '../utils/API';

const DownloadCSVPage: React.FC = () => {
  const handleDownload = async () => {
    await downloadCSV();
  };

  return (
    <div>
      <h1>Download CSV Page</h1>
      <button onClick={handleDownload} className="upload-button">
        Download CSV
      </button>
    </div>
  );
};

export default DownloadCSVPage;
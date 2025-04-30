import React, { useEffect, useState } from 'react';
import { downloadCSV } from '../utils/API';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  label: string;
  value: string;
}

const DownloadCSVPage: React.FC = () => {
  const [csvString, setCsvString] = useState<string>('');
  const [rowData, setRowData] = useState<RowData[]>([]);

  // Fetch the CSV string to preview it
  useEffect(() => {
    const fetchCsvPreview = async () => {
      try {
        const response = await fetch('http://localhost:5000/csv/preview');
        const text = await response.text();
        setCsvString(text);
      } catch (error) {
        console.error('Error fetching CSV preview:', error);
      }
    };

    fetchCsvPreview();
  }, []);

  // Parse the CSV string to show it in the grid
  useEffect(() => {
    if (csvString) {
      const parsedData = csvString
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const parts = line.split(',');
          return {
            label: parts[0]?.trim() || '',
            value: parts.slice(1).join(',').trim(),
          };
        });
      setRowData(parsedData);
    }
  }, [csvString]);

  // Column definitions for Ag Grid
  const columnDefs: ColDef[] = [
    { headerName: 'Label', field: 'label', flex: 1 },
    { headerName: 'Value', field: 'value', flex: 2 },
  ];

  // Handle CSV download
  const handleDownload = async () => {
    try {
      await downloadCSV(); // Triggers CSV download from backend
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div>
      <h1>Download CSV Page</h1>
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%', marginBottom: '20px' }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>

      <button onClick={handleDownload} className="upload-button">
        Download CSV
      </button>
    </div>
  );
};

export default DownloadCSVPage;
import React, { useEffect, useState } from "react";
import { downloadCSV } from "../utils/API";
import { AgGridReact } from "ag-grid-react";
import { ColDef, AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import config from "../config";
import axios from 'axios';

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  label: string;
  value: string;
}

const DownloadCSVPage: React.FC = () => {
  const [csvString, setCsvString] = useState<string>("");
  const [rowData, setRowData] = useState<RowData[]>([]);


  useEffect(() => {
    const fetchCsvPreview = async () => {
      try {
        const response = await axios.get<string>(`${config.apiHost}/csv/preview`, {
          withCredentials: true,
          responseType: 'text',
        });
        setCsvString(response.data);
      } catch (error) {
        console.error("Error fetching CSV preview:", error);
      }
    };

    fetchCsvPreview();
  }, []);


  // Parse the CSV string to show it in the grid
  useEffect(() => {
    if (csvString) {
      const parsedData = csvString
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const parts = line.split(",");
          return {
            label: parts[0]?.trim() || "",
            value: parts.slice(1).join(",").trim(),
          };
        });
      setRowData(parsedData);
    }
  }, [csvString]);

  // Column definitions for Ag Grid
  const columnDefs: ColDef[] = [
    { headerName: "Label", field: "label", flex: 1 },
    { headerName: "Value", field: "value", flex: 2 },
  ];

  // Handle CSV download
  const handleDownload = async () => {
    try {
      await downloadCSV(); // Triggers CSV download from backend
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await fetch(`${config.apiHost}/session/new`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      console.log("New session token:", data.token);
      window.location.href = `/${data.token}/documents`;
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  return (
    <div>
      <h1>Download CSV Page</h1>
      <div
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%", marginBottom: "20px" }}
      >
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>

      <button onClick={handleDownload} className="upload-button">
        Download CSV
      </button>

      <button
        onClick={handleNewSession}
        className="upload-button"
        style={{ marginLeft: "10px" }}
      >
        Analyse Documents Again
      </button>
    </div>
  );
};

export default DownloadCSVPage;

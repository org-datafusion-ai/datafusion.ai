import React, { useCallback, useEffect, useState } from "react";
import { downloadCSV } from "../utils/ExportCSV";
import { AgGridReact } from "ag-grid-react";
import { ColDef, AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import config from "../config";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  label: string;
  value: string;
}

const parseCsvToRowData = (csv: string): RowData[] => {
  return csv
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [label, ...rest] = line.split(",");
      return {
        label: label?.trim() || "",
        value: rest.join(",").trim()
      };
    });
};

const DownloadCSVPage: React.FC = () => {
  const [csvString, setCsvString] = useState<string>("");
  const [rowData, setRowData] = useState<RowData[]>([]);

  const fetchCsvPreview = useCallback(async () => {
    try {
      const response = await axios.get<string>(
        `${config.apiHost}/csv/preview`,
        {
          withCredentials: true,
          responseType: "text"
        }
      );
      setCsvString(response.data);
    } catch (error) {
      console.error("Error fetching CSV preview:", error);
    }
  }, []);

  useEffect(() => {
    fetchCsvPreview();
  }, [fetchCsvPreview]);

  useEffect(() => {
    if (csvString) {
      const data = parseCsvToRowData(csvString);
      setRowData(data);
    }
  }, [csvString]);

  const columnDefs: ColDef[] = [
    { headerName: "Label", field: "label", flex: 1 },
    { headerName: "Value", field: "value", flex: 2 }
  ];

  const handleDownload = async () => {
    try {
      await downloadCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await fetch(`${config.apiHost}/session/new`, {
        method: "GET",
        credentials: "include"
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
      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "5px", color: "#856404" }}>
        <strong>Disclaimer:</strong> This tool uses AI to extract and generate data from uploaded documents. While we strive for accuracy, the results may contain errors. Do not upload confidential or sensitive information. Always verify results before use.
      </div>
    </div>
  );
};

export default DownloadCSVPage;

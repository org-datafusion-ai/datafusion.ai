import React, { useCallback, useEffect, useState } from "react";
import { downloadCSV } from "../utils/ExportCSV";
import { AgGridReact } from "ag-grid-react";
import { ColDef, AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import config from "../config";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  label: string;
  value: string;
}

const DownloadCSVPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${config.apiHost}/csv/preview`, { credentials: "include" }) // Replace with your actual endpoint
      .then(res => {
        return res.text();
      })
      .then(data => {
        if (data.length === 0) return;

        // Split the text response and match quotation marks so CSV format is displayed properly
        const rows = data.split("\n").map(row => {
          return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => {
            // Remove surrounding quotes if present
            if (cell.startsWith('"') && cell.endsWith('"')) {
              return cell.slice(1, -1).replace(/""/g, '"'); // Handle escaped quotes
            }
            return cell;
          });
        });

        // Create columnDefs based on how many columns are in the longest row
        const maxCols = Math.max(...rows.map((row: string[]) => row.length));
        const cols = Array.from({ length: maxCols }, (_, i) => ({
          headerName: i === 0 ? 'Field' : `Value ${i}`,
          field: `col${i}`,
          wrapText: true,
          autoHeight: true,
        }));

        // Transform row data to AG Grid format
        const transformed = rows.map((row: string[]) => {
          const rowObj: any = {};
          row.forEach((cell, i) => {
            rowObj[`col${i}`] = cell;
          });
          return rowObj;
        });

        setColumnDefs(cols);
        setRowData(transformed);
      })
      .catch((error) => {
        console.error("Error fetching CSV preview:", error);
      });
  }, []);

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
        style={{ height: "500px", marginBottom: "20px" }}
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

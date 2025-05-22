import React, { useCallback, useEffect, useState } from "react";
import { downloadCSV } from "../utils/ExportCSV";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import config from "../config";
import axios from "axios";
import NewSessionButton from "../components/NewSessionButton";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import DeleteUploadsButton from "../components/DeleteUploadButton";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
  label: string;
  value: string;
}

const DownloadCSVPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    axios
      .get(`${config.apiHost}/csv/preview`, { withCredentials: true, responseType: "text" })
      .then((response) => {
        const data = response.data as string;

        if (data.length === 0) return;
  
        // Split the text response
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
          headerName: i === 0 ? "Field" : `Value ${i}`,
          field: `col${i}`,
          wrapText: true,
          autoHeight: true
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

  const handleDeleteUploads = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${config.apiHost}/uploads/delete`, {
        withCredentials: true
      });
      const responseData = response.data as { message?: string };
      toast.success(responseData.message || "Uploads deleted successfully.");

      const sessionResponse = await fetch(`${config.apiHost}/session/new`, {
        method: "GET",
        credentials: "include"
      });

      const sessionData = await sessionResponse.json();
      window.location.href = `/${sessionData.token}/documents`;
    } catch (error) {
      console.error("Failed to delete uploads:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <h1>Download CSV Page</h1>
      <div
        className="ag-theme-alpine"
        style={{ height: "50rem", width: "100%", marginBottom: "20px" }}
      >
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
      <button onClick={handleDownload} className="upload-button">
        Download CSV
      </button>
      <NewSessionButton />
      {showConfirm && <ConfirmDeleteModal onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}
      <DeleteUploadsButton onClick={() => setShowConfirm(true)} />
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: "5px",
          color: "#856404"
        }}
      >
        <strong>Disclaimer:</strong> This tool uses AI to extract and generate
        data from uploaded documents. While we strive for accuracy, the results
        may contain errors. Do not upload confidential or sensitive information.
        Always verify results before use.
      </div>
    </div>
  );
};

export default DownloadCSVPage;

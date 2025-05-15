import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "./css/DocumentUploader.css";
import config from "../config";
import axios from "axios";

// Image preview plugin
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// PDF preview plugin
// @ts-ignore
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginPdfPreview,
  FilePondPluginFileValidateSize
);

interface DocumentUploaderProps {
  onFilesUpdate?: (files: File[]) => void; // Optional callback to pass files up
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFilesUpdate
}) => {
  const { sessionToken } = useParams();

  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files before proceeding.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("filepond", file);
    });

    const toastId = toast.loading("AI is thinking...", {
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light"
    });

    try {
      const response = await axios.post(`${config.apiHost}/uploads`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.update(toastId, {
        render: "Information has been analysed by AI",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });

      navigate(`/${sessionToken}/download`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`file-preview ${loading ? "processing" : ""}`}>
        <FilePond
          files={files}
          onupdatefiles={(fileItems) => {
            const newFiles = fileItems
              .map((fileItem) => fileItem.file)
              .filter((f): f is File => !!f);
            setFiles(newFiles);
            if (onFilesUpdate) {
              onFilesUpdate(newFiles); 
            }
          }}
          name="filepond"
          allowMultiple={true}
          allowImagePreview={true}
          maxFiles={6}
          labelFileProcessing="Loading..."
          instantUpload={true}
          maxFileSize={"5MB"}
          labelMaxFileSizeExceeded="File is too large!"
          labelMaxFileSize="Maximum file size is {filesize}"
          disabled={loading}
        />
        <div className="container">
          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;

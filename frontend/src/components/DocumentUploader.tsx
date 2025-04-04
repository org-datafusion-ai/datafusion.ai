import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import './css/DocumentUploader.css';

// Image preview plugin
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// PDF preview plugin
// @ts-ignore
import FilePondPluginPdfPreview from 'filepond-plugin-pdf-preview';
import 'filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.css';

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

// Registering the Plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginPdfPreview, FilePondPluginFileValidateSize);

interface DocumentUploaderProps {
  onFilesUpdate?: (files: File[]) => void; // Optional callback to pass files up
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFilesUpdate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files before proceeding.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("filepond", file);
    });

    try {
      const response = await fetch("http://localhost:5000/uploads", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer YOUR_ACCESS_TOKEN", // If needed
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      console.log("Files uploaded successfully!");
      navigate("/download"); // Navigate after successful upload (pointed to downloads page just for testing)
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };
  
  return (
    <div>
      <div className="file-preview">
        <FilePond
          files={files}
          onupdatefiles={(fileItems) => {
            const newFiles = fileItems.map((fileItem) => fileItem.file as File);
            setFiles(newFiles);
            if (onFilesUpdate) {
              onFilesUpdate(newFiles); // Pass updated files to parent if needed
            }
          }}
          name="filepond"
          allowMultiple={true}
          allowImagePreview={true}
          maxFiles={6}
          instantUpload={true}
          maxFileSize={"5MB"}
          labelMaxFileSizeExceeded="File is too large!"
          labelMaxFileSize="Maximum file size is {filesize}"
        />
        <div className="container">
          <button onClick={handleUpload} className="upload-button">
            Upload & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;

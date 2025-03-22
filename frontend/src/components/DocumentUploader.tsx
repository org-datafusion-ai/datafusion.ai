import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

// Image preview plugin
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// PDF preview plugin
// @ts-ignore
import FilePondPluginPdfPreview from 'filepond-plugin-pdf-preview';
import 'filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.css';

// Registering the Plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginPdfPreview);

interface DocumentUploaderProps {
  onFilesUpdate?: (files: File[]) => void; // Optional callback to pass files up
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFilesUpdate }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilePond
      files={files}
      onupdatefiles={(fileItems) => {
        const newFiles = fileItems.map((fileItem) => fileItem.file as File);
        setFiles(newFiles);
        if (onFilesUpdate) {
          onFilesUpdate(newFiles); // Pass updated files to parent if needed
        }
      }}
      name="filepond" // FilePond requires the field name to match
      allowMultiple={true}
      allowImagePreview={true} // Ensures previews are enabled
      maxFiles={3}
      server={{
        url: "http://localhost:5000", // Base API URL
        process: {
          url: "/uploads", // Correct API endpoint
          method: "POST",
          withCredentials: false,
          headers: {
            "Authorization": "Bearer YOUR_ACCESS_TOKEN", // If authentication is required
          },
        },
      }}
    />
  );
};

export default DocumentUploader;

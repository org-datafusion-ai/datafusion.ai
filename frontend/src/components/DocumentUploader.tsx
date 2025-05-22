import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "./css/DocumentUploader.css";

// Image preview plugin
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// PDF preview plugin
// @ts-ignore
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import "react-toastify/dist/ReactToastify.css";


registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginPdfPreview,
  FilePondPluginFileValidateSize
);

interface DocumentUploaderProps {
  onFilesUpdate?: (files: File[]) => void; 
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFilesUpdate
}) => {

  const [files, setFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

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
          maxFileSize={"2MB"}
          labelMaxFileSizeExceeded="File is too large!"
          labelMaxFileSize="Maximum file size is {filesize}"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default DocumentUploader;

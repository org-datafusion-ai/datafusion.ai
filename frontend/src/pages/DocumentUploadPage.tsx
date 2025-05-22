import React, { useState } from 'react';
import './css/DocumentUploadPage.css';
import DocumentUploader from '../components/DocumentUploader';
import { useNavigate, useParams } from 'react-router-dom';
import config from "../config";
import "../components/css/DocumentUploader.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadButton from '../components/UploadButton';
import axios from "axios";

const DocumentUploadPage: React.FC = () => {
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
      toast.update(toastId, {
        render: "Unsupported file type. Please select only word, excel, pdf, and txt files.",
        type: "error",
        isLoading: false,
        autoClose: 8000,
        closeOnClick: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Documents To Be Analysed</h1>
      <div className={`file-preview ${loading ? "processing" : ""}`}>
        <DocumentUploader onFilesUpdate={setFiles} />
          <UploadButton onClick={handleUpload} loading={loading} />
        </div>
    </div>
  );
};

export default DocumentUploadPage;

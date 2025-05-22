import React from "react";

interface UploadButtonProps {
  onClick: () => void;
  loading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick, loading }) => {
  return (
    <div className="container">
      <button
        onClick={onClick}
        className="upload-button"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload & Continue"}
      </button>
    </div>
  );
};

export default UploadButton;

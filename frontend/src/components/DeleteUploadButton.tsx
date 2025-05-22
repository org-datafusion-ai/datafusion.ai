import React from "react";

interface Props {
  onClick: () => void;
}

const DeleteUploadsButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="upload-button"
      style={{
        marginLeft: "10px",
        backgroundColor: "#dc3545",
        color: "white"
      }}
    >
      Delete Uploads
    </button>
  );
};

export default DeleteUploadsButton;

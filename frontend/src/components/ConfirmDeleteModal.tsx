import React from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          maxWidth: "400px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)"
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#dc3545" }}>
          ⚠️ Confirm Deletion
        </h2>
        <p>
          Are you sure you want to delete all uploaded documents and
          processed data? <br />
          <strong>This action cannot be undone.</strong>
        </p>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 20px",
              marginRight: "10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
           Delete
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

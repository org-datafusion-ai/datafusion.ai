import React from "react";
import config from "../config";
import axios from "axios";

const NewSessionButton: React.FC = () => {
  const handleNewSession = async () => {
    try {
      const response = await axios.get<{ token: string }>(`${config.apiHost}/session/new`, {
        withCredentials: true
      });
      window.location.href = `/${response.data.token}/documents`;
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  return (
    <button onClick={handleNewSession} className="upload-button" style={{ marginLeft: "10px" }}>
      Analyse Documents Again
    </button>
  );
};

export default NewSessionButton;

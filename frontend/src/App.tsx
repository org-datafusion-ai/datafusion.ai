import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import DocumentUploadPage from './pages/DocumentUploadPage';
import DownloadCSVPage from './pages/DownloadCSVPage';
import config from './config';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Send a simple ping to backend to trigger session cookie middleware
        const res = await fetch(`${config.apiHost}/session`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
      const currentPath = window.location.pathname;

      
      const targetPath = `/${data.token}/documents`;
      if (data.token && currentPath !== targetPath) {
        window.location.href = targetPath;
      }

      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();
  });


  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Navbar />
        </header>
        <main className="content">
          <Routes>
            <Route path="/:sessionToken/download" element={<DownloadCSVPage />} />
            <Route path="/:sessionToken/documents" element={<DocumentUploadPage />} />
            <Route path="/" element={<Navigate to="/:sessionToken/documents" />} />
          </Routes>
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;

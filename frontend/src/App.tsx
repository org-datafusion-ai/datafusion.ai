import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import DocumentUploadPage from './pages/DocumentUploadPage';
import DownloadCSVPage from './pages/DownloadCSVPage';
import Login from './pages/LoginPage';
import { useAuth } from './utils/AuthContext';

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Navbar />
        </header>
        <main className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/documents" element={isAuthenticated ? <DocumentUploadPage /> : <Navigate replace to="/login" />} />
            <Route path="/" element={<Navigate replace to={isAuthenticated ? "/documents" : "/login"} />} />
            <Route path="/download" element={<DownloadCSVPage />} />
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

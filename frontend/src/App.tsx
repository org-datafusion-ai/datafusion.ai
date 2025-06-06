import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import DocumentUploadPage from './pages/DocumentUploadPage';
import DownloadCSVPage from './pages/DownloadCSVPage';
import config from './config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppRouter() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    const initializeSession = async () => {
      const currentPath = window.location.pathname;

      if (currentPath !== '/') return;
  
      try {
        const res = await fetch(`${config.apiHost}/session/new`, {
          method: 'GET',
          credentials: 'include',
        });
  
        const data = await res.json();
  
        if (data.token) {
          setToken(data.token);
          navigate(`/${data.token}/documents`);
        }
  
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };
  
    initializeSession();
  }, [navigate]);  


  return (
    <div className="app-container">
      <header className="header">
        <Navbar />
      </header>
      <main className="content">
        <Routes>
          <Route path="/:sessionToken/download" element={<DownloadCSVPage />} />
          <Route path="/:sessionToken/documents" element={<DocumentUploadPage />} />
          <Route path="/"
            element={
              token ? <Navigate to={`/${token}/documents`} /> : <div>Loading...</div>
            } />
        </Routes>
      </main>
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRouter />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;

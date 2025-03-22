import './css/Navbar.css';
import React, { useState, useEffect } from 'react';
import Logout from './Logout';
import { useAuth } from '../utils/AuthContext';
import hamburgerMenuIcon from '../images/hamburger.png';

const Navbar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Use div or span for the clickable hamburger icon */}
        <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={hamburgerMenuIcon} alt="Menu" className="hamburger-icon" />
        </div>

        {/* Slide-Out Menu */}
        <div className={`menu ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => alert('Home Clicked')}>Home</button>
          <button onClick={() => alert('Upload Clicked')}>Upload</button>
          <button onClick={() => alert('Settings Clicked')}>Settings</button>
        </div>

        {/* App Name */}
        <div className="app-name">DataFusion.AI</div>
        {isAuthenticated && <Logout/>}  
        </div>
      </nav>
  );
};

export default Navbar;

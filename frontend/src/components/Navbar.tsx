import './css/Navbar.css';
import React, { useState, useEffect } from 'react';
import Logout from './Logout';
import { useAuth } from '../utils/AuthContext';
import Hamburger from './Hamburger'; // Import the Hamburger component
import Sidebar from './Sidebar'; // Import Sidebar component

const Navbar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen); // Toggle sidebar visibility
  };

  const handleCloseSidebar = () => {
    setMenuOpen(false); // Close the sidebar when the close button is clicked
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [setIsAuthenticated]);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          {/* Include the Hamburger component */}
          <Hamburger onClick={handleMenuToggle} />
          {/* App Name */}
          <div className="app-name">DataFusion.AI</div>
          {isAuthenticated && <Logout/>}
        </div>
      </nav>
      
      {/* Sidebar */}
        <Sidebar isOpen={menuOpen} onClose={handleCloseSidebar} />
      </div>
  );
};

export default Navbar;

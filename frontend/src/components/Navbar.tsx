import './css/Navbar.css';
import React, { useState, useEffect } from 'react';
import Hamburger from './Hamburger'; // Import the Hamburger component
import Sidebar from './Sidebar'; // Import Sidebar component

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen); // Toggle sidebar visibility
  };

  const handleCloseSidebar = () => {
    setMenuOpen(false); // Close the sidebar when the close button is clicked
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="app-name">DataFusion.AI</div>
        </div>
      </nav>
      
      {/* Sidebar */}
        <Sidebar isOpen={menuOpen} onClose={handleCloseSidebar} />
      </div>
  );
};

export default Navbar;

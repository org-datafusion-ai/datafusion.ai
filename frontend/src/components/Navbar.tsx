import "./css/Navbar.css";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="app-name">DataFusion.AI</div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

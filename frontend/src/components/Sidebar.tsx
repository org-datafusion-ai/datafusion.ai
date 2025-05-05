// Sidebar.tsx
import React from 'react';
import './css/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;  // Whether the sidebar is open or not
  onClose: () => void; // Close the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        &times; {/* X icon to close the sidebar */}
      </button>
      <ul className="sidebar-menu">
        <li><button onClick={() => alert('Home Clicked')}>Home</button></li>
        <li><button onClick={() => alert('Upload Clicked')}>Upload</button></li>
        <li><button onClick={() => alert('Settings Clicked')}>Settings</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
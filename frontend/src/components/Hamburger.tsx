import React from 'react';
import hamburgerMenuIcon from '../images/hamburger.png';

interface HamburgerProps {
  onClick: () => void; // Callback to handle menu toggle
}

const Hamburger: React.FC<HamburgerProps> = ({ onClick }) => {
  return (
    <button className="hamburger-menu" onClick={onClick} aria-label="Toggle Menu">
      <img src={hamburgerMenuIcon} alt="Hamburger Menu" className="hamburger-icon" />
    </button>
  );
};

export default Hamburger;
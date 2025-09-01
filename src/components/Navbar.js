import React from 'react';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); 

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-10 h-16 border-gray-100 border-b-2">
      <div className="flex flex-wrap items-center justify-between px-4 py-4">
        <a href="#" className="flex items-center">
          <img src="https://raw.githubusercontent.com/harris-mariano/HAP/develop/public/images/logo-name.png" className="w-23 h-10" alt="Logo" />
        </a>
      </div>
    </header>
  )
}

export default Navbar

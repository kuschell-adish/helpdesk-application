import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 

function Navbar() {
  const location = useLocation(); 
  const showProfile = location.pathname !== "/login"; 
  
  const { user } = useUser(); 

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-10 h-16 border-gray-100 border-b-2">
      <div className="flex flex-wrap items-center justify-between px-4 py-4">
        <a href="#" className="flex items-center">
          <img src="https://raw.githubusercontent.com/harris-mariano/HAP/develop/public/images/logo-name.png" className="w-23 h-10" alt="Logo" />
        </a>
        {showProfile && (
          <div className="flex items-center gap-3">
          <img src="/default.png" className="w-10 h-10 rounded-full" alt="Default Profile Picture" />
          <a href="#">
            <div className="flex flex-col">
              <p className="text-xs font-medium">{user?.first_name}  {user?.last_name}</p>
              <p className="text-xs">{user?.position} at {user?.company?.name}</p>
            </div>
          </a>
        </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

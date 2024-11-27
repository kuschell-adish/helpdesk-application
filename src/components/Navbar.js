import React from 'react'

function Navbar() {
  return (
    <header className="bg-white fixed top-0 left-0 w-full z-10 h-16 border-gray-50 border-b-2">
      <div className="flex flex-wrap items-center justify-between px-4 py-4">
        <a href="#" className="flex items-center">
          <img src="https://raw.githubusercontent.com/harris-mariano/HAP/feature/create_superuser_view/public/images/logo-name.png" className="w-23 h-10" alt="Logo" />
        </a>
        <div className="flex items-center gap-3">
          <img src="/default.png" className="w-10 h-10 rounded-full" alt="Default Profile Picture" />
          <a href="#">
            <div className="flex flex-col">
              <p className="text-xs font-medium">Juan Dela Cruz</p>
              <p className="text-xs">Account Manager at XYZ International</p>
            </div>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar

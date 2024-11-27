import React from 'react'
import { NavLink, useMatch } from 'react-router-dom';

function NavItem({link, icon, label}) {
    const isActive = useMatch(link); 
  return (
    <NavLink 
        to ={link}
        className={`flex flex-row gap-x-3 items-center text-center py-3 ${isActive ? 'bg-orange-500 px-10 ' : 'hover:border-b-2 border-orange-500'}`}>
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-5 ${isActive ? 'text-white' : 'text-orange-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <p className={`font-medium text-xs ${isActive && 'text-white'}`}>{label}</p>
            </div>
    </NavLink>
  )
}

export default NavItem

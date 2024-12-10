import React from 'react'
import { NavLink, useMatch } from 'react-router-dom';

function NavItem({link, icon, label, onClick}) {
    const matchParent = useMatch(link);
    const matchChildren = useMatch(`${link}/:id`);
    const isActive = matchParent || matchChildren; 
  return (
    <NavLink 
        to ={link}
        className={`flex flex-row gap-x-3 items-center text-center py-3 ${isActive ? 'bg-orange-500 px-10 ' : 'hover:border-b-2 border-orange-500'}`}
        onClick={onClick}>
            <div className="flex flex-col items-center">
            {React.cloneElement(icon, {
                    className: `${isActive ? 'text-white' : 'text-orange-500'}` 
                })}
            <p className={`font-medium text-xs ${isActive && 'text-white'}`}>{label}</p>
            </div>
    </NavLink>
  )
}

export default NavItem

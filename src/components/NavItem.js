import React from 'react'
import { NavLink, useMatch } from 'react-router-dom';

function NavItem({link, icon, label, isOpen, onClick}) {
    const matchParent = useMatch(link);
    const matchChildren = useMatch(`${link}/:id`);
    const isActive = matchParent || matchChildren; 
  return (
    <NavLink 
        to ={link}
        className={`flex flex-row py-3 ${isActive ? 'border-b-2 border-b-2 border-orange-500' : 'hover:border-b-2 border-orange-500'}`}
        onClick={onClick}>
            <div className="flex flex-row gap-2">
            {React.cloneElement(icon, {
                    className: "text-orange-500" 
                })}
            {isOpen ? <p className={`font-medium text-xs ${isActive && 'text-orange-500 font-medium'}`}>{label}</p> : ''}
            </div>
    </NavLink>
  )
}

export default NavItem

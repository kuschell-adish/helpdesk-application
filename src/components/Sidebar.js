import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';

import { LuLayoutDashboard } from "react-icons/lu";
import { TiDocumentAdd } from "react-icons/ti";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";


function Sidebar() {
    const [user, setUser] = useState(""); 
    const handleLogout = () => {
        sessionStorage.removeItem('token'); 
        setUser(null); 
    }

    useEffect(() => {
        const authenticatedUser = localStorage.getItem('user');
        setUser(JSON.parse(authenticatedUser)); 
    },[])
    
  return (
    <div>
      <div className="fixed w-1/12 h-screen p-3 px-8 hidden md:block">
        <div className="flex flex-col justify-around gap-10">
            <div className="flex flex-col gap-y-2.5 items-center">
                <NavItem 
                    link = "/dashboard"
                    icon = {<LuLayoutDashboard />}
                    label= "Dashboard"
                />
                <NavItem 
                    link = "/ticket/create"
                    icon = {<TiDocumentAdd />}
                    label= "File Ticket"
                />
                <NavItem 
                    link = "/tickets"
                    icon = {<IoDocumentsOutline />}
                    label= "My Tickets"
                />
                {user?.role === 'admin' && (
                <NavItem 
                    link = "/assigned/tickets"
                    icon = {<IoDocumentsOutline />}
                    label= "Assigned Tickets"
                />
                )}
                <NavItem 
                    link = "/articles"
                    icon = {<GoQuestion />}
                    label= "Knowledge Base"
                />
                 <NavItem 
                    link = "/profile"
                    icon = {<CiUser />}
                    label= "My Profile"
                />
                <NavItem 
                    link = "/login"
                    icon = {<IoLogOutOutline />}
                    label= "Logout"
                    onClick={handleLogout}
                />
            </div>
        </div>
    </div>
</div>
  )
}

export default Sidebar

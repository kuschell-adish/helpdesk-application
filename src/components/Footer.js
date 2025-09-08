import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';

import { LuLayoutDashboard } from "react-icons/lu";
import { TiDocumentAdd } from "react-icons/ti";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";

import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const [user, setUser] = useState(""); 
    const [isOpen, setIsOpen] = useState(false); 
    const navigate = useNavigate();
    const handleLogout = async(e) => {
        e.preventDefault();
        try {
        const response = await axiosInstance.post('/logout');          
          localStorage.removeItem("user");       
          console.log("logged out:", response.data); 
          navigate('/login'); 
        }
        catch(error) {
          console.error("Error posting data", error); 
        }
      }

    useEffect(() => {
        const authenticatedUser = localStorage.getItem('user');
        setUser(JSON.parse(authenticatedUser)); 
    },[]);
    
  return (
    <div className="">
      <div className={`fixed w-full h-10 bottom-0 left-0 bg-white border-t-2 border-gray-200 shadow-xl p-3 px-5 z-10 transition-all duration-300 ease-in-out`}>
        <div className="text-xl hover:text-orange-500 z-11">
        {/* <img src="/favicon.ico" className="w-5 h-5" /> */}
        </div>
        <div className="flex flex-row">
            <div className="flex flex-row items-center justify-between">
                <NavItem 
                    link = "/dashboard"
                    icon = {<LuLayoutDashboard />}
                    label= "Dashboard"
                    isOpen={isOpen}
                />
                <NavItem 
                    link = "/ticket/create"
                    icon = {<TiDocumentAdd />}
                    label= "File Ticket"
                    isOpen={isOpen}
                />
                <NavItem 
                    link = "/tickets"
                    icon = {<IoDocumentsOutline />}
                    label= "My Tickets"
                    isOpen={isOpen}
                />
                {user?.role === 'admin' && (
                <NavItem 
                    link = "/assigned/tickets"
                    icon = {<IoDocumentsOutline />}
                    label= "Assigned Tickets"
                    isOpen={isOpen}
                />
                )}
                <NavItem 
                    link = "/articles"
                    icon = {<GoQuestion />}
                    label= "Knowledge Base"
                    isOpen={isOpen}
                />
                 <NavItem 
                    link = "/profile"
                    icon = {<CiUser />}
                    label= "My Profile"
                    isOpen={isOpen}
                />
                <NavItem 
                    link = "/login"
                    icon = {<IoLogOutOutline />}
                    label= "Logout"
                    onClick={handleLogout}
                    isOpen={isOpen}
                />
            </div>
        </div>
    </div>
</div>
  )
}

export default Footer

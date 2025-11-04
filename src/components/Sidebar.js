import React, { useState } from 'react';
import NavItem from './NavItem';

import { LuLayoutDashboard } from "react-icons/lu";
import { TiDocumentAdd } from "react-icons/ti";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";

import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Sidebar() {
    const { user } = useUser(); 
    const [isOpen, setIsOpen] = useState(false); 
    const navigate = useNavigate();
    const handleLogout = async(e) => {
        e.preventDefault();
        try {
        const response = await axiosInstance.post('/logout');     
          localStorage.clear();      
          console.log("logged out:", response.data); 
          navigate('/login'); 
        }
        catch(error) {
          console.error("Error posting data", error); 
        }
      }
    
  return (
    <>
      <div className="min-h-screen hidden md:block">
        <div className={`${isOpen ? 'w-1/5 md:w-1/6' : 'w-1/20'} fixed top-0 left-0 h-screen bg-white shadow-inner border-r p-3 px-5 z-10 transition-all duration-300 ease-in-out`}>
          <div className="text-xl hover:text-orange-500 z-11">
            <button onClick={() => setIsOpen(!isOpen)}>
              <img src="/favicon.ico" className="w-5 h-5" alt="logo-icon" />
            </button>
          </div>
          <div className="flex flex-col">
              <div className="flex flex-col gap-y-2.5">
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
                  {user?.role === 'admin' && (
                    <NavItem 
                        link = "/users"
                        icon = {<HiOutlineUserGroup />}
                        label= "Users"
                        isOpen={isOpen}
                    />
                  )}
                  <NavItem 
                      link = "/profile"
                      icon = {<HiOutlineUser />}
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

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around items-center py-2 md:hidden z-10">
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
          {user?.role === 'admin' && (
            <NavItem 
              link = "/users"
              icon = {<HiOutlineUserGroup />}
              label= "User Roles"
              isOpen={isOpen}
            />
          )}
          <NavItem 
            link = "/profile"
            icon = {<HiOutlineUser />}
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
    </>
  )
}

export default Sidebar

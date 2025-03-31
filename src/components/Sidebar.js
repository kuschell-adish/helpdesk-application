import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
import axios from 'axios';

import { LuLayoutDashboard } from "react-icons/lu";
import { TiDocumentAdd } from "react-icons/ti";
import { IoDocumentsOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";

import { getUrl } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';


function Sidebar() {
    const [user, setUser] = useState(""); 
    const url = getUrl('auth/logout'); 
    const navigate = useNavigate(); 
    // const token = localStorage.getItem('token');
    // console.log(token);
    const handleLogout = (e) => {
        // const logOut = async() => {
        //     try {
        //         const response = await axios.post(url, {
        //             headers: {
        //                 'authorization': token
        //             }
        //         }); 
        //         console.log(response.data.message); 

        //         localStorage.removeItem('user'); 
        //         localStorage.removeItem('tickets'); 
        //         localStorage.removeItem('token'); 
        //         setUser(null); 

        //         navigate('/login'); 
               
        //     }
        //     catch(error){
        //         console.error("Error getting data", error); 
        //     }
        // }
        // logOut(); 
                 localStorage.removeItem('user'); 
                localStorage.removeItem('tickets'); 
                localStorage.removeItem('token'); 
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
                {user.role_id !== 3 && (
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

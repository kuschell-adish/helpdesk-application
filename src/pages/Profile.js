import React, { useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    useEffect(() => {
        document.title = 'adish HAP | My Profile'
    },[]);
  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col md:flex-row gap-x-10 pt-20">
            <div className="flex-none md:w-20 lg:w-28">
                <Sidebar />
            </div>
            <div className="w-full bg-white p-5 rounded-lg shadow mr-3 mb-5">
              <p className="text-sm font-semibold">My Personal Information</p>
              <UserProfile />
            </div>
        </div>
    </div>
  )
}

export default Profile

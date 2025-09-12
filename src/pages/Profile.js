import React, { useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import Sidebar from '../components/Sidebar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {

  useEffect(() => {
      document.title = 'adish HAP | My Profile';
    },[]);

  return (
    <div className="bg-gray-50 min-h-screen">
        <ToastContainer />
        <div className="flex flex-col md:flex-row p-5">
          <div className="w-[4%]">
            <Sidebar/>
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

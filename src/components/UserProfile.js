import React from 'react';
import { useState } from 'react';

import Input from './Input';
import Button from './Button';

import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

function UserProfile() {
  const { user } = useUser(); 
  const [preview, setPreview] = useState(user?.profile_picture ? user?.profile_picture : './default.png');
  const [hasFileError,setHasFileError] = useState(false); 
  const [errorMessage,setErrorMessage] = useState(""); 
  
  const fileTypes = new Set([
    'image/jpeg', 
    'image/png',  
    'image/bmp'
  ]);
  const [profilePicture, setProfilePicture] = useState("");

  const isButtonDisabled = () => {
    return !profilePicture; 
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    const maxSize = 2 * 1024 * 1024; //2mb 
    let errorMessage = ""; 
    let allowedFiles = true; 
    
    //wrong file type
    if (!fileTypes.has(file.type)) {
      allowedFiles = false; 
      errorMessage = "Only .jpg, .jpeg, .png, .bmp files are allowed.";
  
    }
    //wrong size
    if (file.size > maxSize) {
      allowedFiles = false; 
      errorMessage = "The maximum file size allowed is 2MB."
    }

    if (!allowedFiles) {
      setHasFileError(true);
      setErrorMessage(errorMessage);
      event.target.value = '';
    }
    else {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result); 
      };
      fileReader.readAsDataURL(file);
      setHasFileError(false); 
      setErrorMessage(""); 
      setProfilePicture(file); 
    }
  }

  const handleButtonClick = async(e) => {
    e.preventDefault(); 
    try {
        const formData = new FormData();

        if (profilePicture) {
          formData.append("profilePicture", profilePicture); 
        }

        const response = await axiosInstance.post(`/update/profile`, formData);
        console.log("passed data:", response.data); 
        toast.success("Your profile has been submitted successfully.");
        setProfilePicture(""); 
    }
    catch(error) {
        console.error("Error posting data", error); 
    }
  }

  const handleChangePasswordClick = () => {
    //to-do 
  }

  return (
    <div className="w-full flex flex-col justify-center items-center my-10 gap-10 md:flex-row">
      <div className="w-1/2 flex flex-col items-center justify-center">
        <label htmlFor="profile_picture" className="text-sm font-medium">Profile Picture</label>
        <img id="profile_picture_preview" src={preview} className="w-20 h-20 mb-3 mt-2 rounded-full object-cover" alt="user-profile" />
        {user?.login_provider === 'manual' && 
        <>
        <input id="profilePicture" name="profilePicture" type="file" className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-sm file:bg-[#EAEAEA]" accept=".png, .jpg, .jpeg" onChange={handleFileChange}></input>
        <div className="flex flex-col mb-5 text-center">
          <p className="text-xs text-gray-400 mt-1 mb-1">Accepts formats such as JPEG and PNG and must not exceed into 2MB.</p>
          {hasFileError && <p className="text-xs text-red-500">{errorMessage}</p>}
        </div>
        <div className="w-full md:w-1/4">
          <div className="w-1/10 md:1/4 mr-2">
            <Button 
              type="submit"
              label="Update"
              isPrimary={true}
              isDisabled={isButtonDisabled()}
              onClick={handleButtonClick}
              />
          </div>
        </div>
        </>}
      </div>
      <div className="w-full md:w-1/2">
        <Input
          label="Name"
          type="text"
          name="first_name"
          value={user?.first_name || ''}
          isDisabled={true}
        />
         <Input
          label="Middle Name"
          type="text"
          name="middle_name"
          value={user?.middle_name || ''}
          isDisabled={true}
        />
        <Input
          label="Name"
          type="text"
          name="last_name"
          value={user?.last_name || ''}
          isDisabled={true}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value={user?.email || ''}
          isDisabled={true}
        />
        <Input
          label="Department"
          type="text"
          name="department"
          value={user?.department?.category || ''}
          isDisabled={true}
        />
        <Input
          label="Company"
          type="text"
          name="company"
          value="Adish International Corporation"
          isDisabled={true}
        />
        <div className="w-1/10 md:1/4 flex flex-col justify-end">
          <p className="text-sm font-semibold">Change Password</p>
            <Button 
              type="submit"
              label="Generate Password Reset Link"
              isPrimary={false}
              onClick={handleChangePasswordClick}
              />
          </div>
      </div>
    </div>
  )
}

export default UserProfile

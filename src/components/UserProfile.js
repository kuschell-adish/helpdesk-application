import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Input from './Input';
import Button from './Button';

import { useUser } from '../context/UserContext'; 
import { getUrl } from '../utils/apiUtils';

function UserProfile() {
  const { user } = useUser(); 
  const [preview, setPreview] = useState("/default.png");
  const [hasFileError,setHasFileError] = useState(false); 
  const [errorMessage,setErrorMessage] = useState(""); 
  const fileTypes = new Set([
    'image/jpeg', 
    'image/png',  
    'image/bmp'
  ]);
  const [profilePicture, setProfilePicture] = useState("");
  const url = getUrl(`users/${user?.id}`);   

  const handleUpdateClick = async() => {
   try {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture); 

    const response = await axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    console.log("passed data:", response.data); 
    toast.success("Your profile has been updated successfully.");
   }
   catch(error) {
    console.error("Error updating data", error); 
  }
  } 

  const isButtonDisabled = () => {
    return !profilePicture; 
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    const maxSize = 2 * 1024 * 1024; //2mb 
    let errorMessage = ""; 
    let allowedFiles = true; 
    console.log(file); 
    
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
      setProfilePicture();
      event.target.value = '';
    }
    else {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result); 
      };
      fileReader.readAsDataURL(file);
      setHasFileError(false); 
      setProfilePicture(file); 
      setErrorMessage(""); 
    }
  }

  console.log("user", user?.profile_picture);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <label htmlFor="profile_picture" className="text-sm font-medium">Profile Picture</label>
        <img id="profile_picture_preview" src={preview} className="w-20 h-20 mb-3 mt-2 rounded-full object-cover" alt="Profile Picture" />

        <img  src={`http://127.0.0.1:8000${user.profile_picture}`} className="w-20 h-20 mb-3 mt-2 rounded-full object-cover" alt="Profile Picture" />

        <input type="file" name="profile_picture" id="profile_picture" className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-sm file:bg-[#EAEAEA]" accept=".png, .jpg, .jpeg, .tiff, .tif" onChange={handleFileChange}></input>
        <div className="flex flex-col mb-5 text-center">
          <p className="text-xs text-gray-400 mt-1 mb-1">Accepts formats such as JPEG, PNG, BMP, TIFF, and must not exceed into 2MB.</p>
          {hasFileError && <p className="text-xs text-red-500">{errorMessage}</p>}
        </div>
      </div>
       <div className="grid grid-cols-2 gap-x-24 px-2 py-3">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={user?.first_name || ''}
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
          label="Middle Name"
          type="text"
          name="middle_name"
          value={user?.middle_name || ''}
          isDisabled={true}
        />
        <Input
          label="Company"
          type="text"
          name="company"
          value={user?.company?.name|| ''}
          isDisabled={true}
        />
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={user?.last_name || ''}
          isDisabled={true}
        />
        <Input
          label="Position"
          type="text"
          name="position"
          value={user?.position || ''}
          isDisabled={true}
        />
        </div>
        <div className="w-full flex justify-end">
          <div className="w-1/12 flex justify-end mr-2">
            <Button 
              type="submit"
              label="Update"
              isPrimary={true}
              onClick={handleUpdateClick}
              isDisabled={isButtonDisabled()}
              />
          </div>
        </div>
    </div>
  )
}

export default UserProfile
